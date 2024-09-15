import { Request, Response } from "express";
import UserDTO from "../dto/UserDTO";
import { UserGetDTO, UserInsertDTO } from "../utils/types/TUser";
import { getDefaultPass, hashPass } from "../utils/generics";
import { TGenericResponse } from "../utils/types/IGenerics";
import RltsService from "./RelationshipsService";
import RelationsDTO, {
  RltUpdateDTO,
  RltUpdateWithChargedDTO,
} from "../dto/RelationsDTO";
import UserGroupDTO from "../dto/UserGroupDTO";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GroupGetDTO } from "../utils/types/TGroup";
import { IUserSet } from "../utils/types/IUserTypes";
import crypto from "crypto";
import EmailService from "./EmailService";

class UserService {
  async getUserDispensedCommission(userId: number): Promise<TGenericResponse> {
    try {
      const user = await UserDTO.getById(userId);
      if (!user) {
        return {
          success: false,
          status: 500,
          error: "User's group not found",
        };
      }
      return {
        success: true,
        status: 200,
        data: user.charged,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: { error: error.message },
      };
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<TGenericResponse> {
    try {
      const user = await UserDTO.getByEmail(email);
      if (!user) {
        return { success: false, status: 404, error: "User not found" };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour


      // Store the reset token and its expiration in the database
      await UserDTO.updateById(user.id, { resetToken, resetTokenExpiry });

      // Send the reset email
      const resetLink = `https://masari.me/change-password/${resetToken}/${user.id}`;
      await EmailService.sendPasswordResetEmail(user.email, resetLink);

      return { success: true, status: 200, data: "Reset email sent" }; // Changed message to data
    } catch (error: any) {
      return { success: false, status: 500, error: error.message };
    }
  }

  // Reset password method
  async resetPassword(
    userId: number,
    token: string,
    newPassword: string
  ): Promise<TGenericResponse> {
    try {
      const user = await UserDTO.getById(userId);
     
      if (
        !user ||
        user.resetToken !== token ||
        Date.now() > (user.resetTokenExpiry || 0)
      ) {
        return {
          success: false,
          status: 400,
          error: "Invalid or expired token",
        };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear the reset token
      await UserDTO.updateById(userId, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      return {
        success: true,
        status: 200,
        data: "Password reset successfully",
      }; // Change message field to data
    } catch (error: any) {
      return { success: false, status: 500, error: error.message };
    }
  }

  async getAllUsers(): Promise<TGenericResponse> {
    const users = await UserDTO.getAll();

    const usersWithUplines = await Promise.all(
      users.map(async (user) => await this.addUpline(user))
    );
    return {
      success: true,
      status: 200,
      data: usersWithUplines,
    };
  }

  // checkTotal(updateArgsArray: RltUpdateDTO[], dispensed: number): boolean {
  //   let sum = 0;
  //   updateArgsArray.forEach((arg) => (sum += arg.commissionChunk));
  //   return sum === dispensed;
  // }

  checkTotal(
    updateArgsArray: RltUpdateDTO[],
    charged: number,
    cashout: number
  ): boolean {
    let totalCommissions = 0;
    updateArgsArray.forEach((arg) => (totalCommissions += arg.commissionChunk));

    // Total should include both commission chunks and cashout
    const total = totalCommissions + cashout;

    // Check if the total equals the charged amount
    return total === charged;
  }

  async addUpline(user: UserGetDTO): Promise<UserGetDTO> {
    const uplineRlt = await RltsService.getDirectUpline(user.id);
    if (uplineRlt?.uplineId) {
      const upline = await UserDTO.getById(uplineRlt?.uplineId);
      user.uplineId = upline.id;
      user.uplineEmail = upline.email;
      user.uplineFirstName = upline.firstName;
      user.uplineLastName = upline.lastName;
      user.uplinePhoneNumber = upline.phoneNumber;
    }
    return user;
  }

  async getProfile(id: number): Promise<TGenericResponse> {
    try {
      let user = await UserDTO.getById(id);
      if (!user)
        return {
          success: false,
          status: 500,
          error: { error: "User not found" },
        };
      user = await this.addUpline(user);
      return {
        success: true,
        status: 200,
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: { error: error.message },
      };
    }
  }

  async login(email: string, password: string): Promise<TGenericResponse> {
    try {
      const user = await UserDTO.getAllInfoByEmail(email);
      if (!user) {
        return {
          success: false,
          status: 500,
          error: { error: "Invalid username or password" },
        };
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          status: 500,
          error: { error: "Invalid username or password" },
        };
      }
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY as string
      );
      return {
        success: true,
        status: 200,
        data: { token },
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: { error: error.message },
      };
    }
  }

  async updateRelationship(
    update: RltUpdateWithChargedDTO
  ): Promise<TGenericResponse> {
    try {
      const updateArgsArray = update.relationships;
      const downlineId = updateArgsArray[0].downlineId;
      if (!downlineId) {
        return {
          success: false,
          status: 500,
          error: { error: "Error: cannot find downlineId" },
        };
      }

      // Check if the dispensed total is correct
      if (!this.checkTotal(updateArgsArray, update.dispensed, update.cashout)) {
        // Changed dispensed to charged
        return {
          success: false,
          status: 500,
          error: { error: "Total not equal to 100%" },
        };
      }

      // Update the user data including cashout
      await this.updateUser(downlineId, {
        charged: update.charged,
        dispensed: update.charged, // Ensure dispensed is always equal to charged
        cashout: update.cashout,
      });

      // Update the relationships
      await Promise.all(
        updateArgsArray.map(
          async (updateArgs) => await RelationsDTO.updateById(updateArgs)
        )
      );

      return {
        success: true,
        status: 200,
        data: true,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: { error: error.message },
      };
    }
  }

  async updateUser(
    downlineId: number,
    args: Partial<IUserSet>
  ): Promise<TGenericResponse> {
    try {
      const update = await UserDTO.updateById(downlineId, args);
      if (!update) {
        return {
          success: false,
          status: 500,
          error: "An error occured while updating user",
        };
      }
      return {
        success: true,
        status: 200,
        data: true,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: { error: error.message },
      };
    }
  }

  async getUser(id: number): Promise<TGenericResponse> {
    try {
      const profile = await UserDTO.getById(id);
      if (!profile) {
        return {
          success: false,
          status: 500,
          error: "Couldnt find user with id " + id,
        };
      }
      return {
        success: true,
        status: 200,
        data: profile,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async createUser(
    args: UserInsertDTO,
    uplineId: number | undefined,
    downlineIds: number[]
  ): Promise<TGenericResponse> {
    try {
      if (uplineId && downlineIds.length) {
        const valid = await this.checkDownlinesUpline(uplineId, downlineIds);
        if (!valid) {
          return {
            success: false,
            status: 500,
            error: "Not direct downlines to provided upline",
          };
        }
      }

      const emailAlreadyInUse = await UserDTO.getByEmail(args.email);
      if (emailAlreadyInUse) {
        return {
          success: false,
          status: 400,
          error: "Email already in use",
        };
      }
      const hashedPass = await getDefaultPass();
      let userGroup: GroupGetDTO | undefined;
      if (typeof uplineId !== "undefined") {
        userGroup = await UserGroupDTO.getGroupByUserId(uplineId);
      }

      const insertObject: UserInsertDTO = {
        ...args,
        password: hashedPass,
        isAdmin: false,
        createdAt: new Date(),
        charged: userGroup?.totalCommission || 0,
        dispensed: userGroup?.totalCommission || 0, // Dispensed is set equal to charged
      };

      const insertedAccount = await this.insert(insertObject);
      if (typeof uplineId !== "undefined" && userGroup) {
        await UserGroupDTO.insert({
          groupId: userGroup.id,
          userId: insertedAccount.id,
        });
        const downlineId = insertedAccount.id;
        await RltsService.addUplines(uplineId, downlineId);

        if (downlineIds.length > 0) {
          for (const childId of downlineIds) {
            await RltsService.deleteAllByDownlineId(childId);
            await RltsService.addUplines(downlineId, childId);
            const insertedAccountChildren = await RltsService.getDownlines(
              childId
            );
            for (const children of insertedAccountChildren) {
              const directUpline = await RltsService.getDirectUpline(
                children.downlineId
              );
              if (!directUpline) continue;
              await RltsService.deleteAllByDownlineId(children.downlineId);
              await RltsService.addUplines(
                directUpline.uplineId,
                children.downlineId
              );
            }
          }
        }
      }
      return {
        success: true,
        status: 201,
        data: insertedAccount,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async deleteAccount(id: number): Promise<TGenericResponse> {
    try {
      await UserGroupDTO.delete(id);
      const upline = await RltsService.getDirectUpline(id);
      const uplineId = upline?.uplineId;
      const deletedAccountChildren = await RltsService.getDownlines(id);
      if (!uplineId) {
        return {
          success: false,
          status: 400,
          error: "Account does not have upline",
        };
      }
      await RltsService.deleteAllByDownlineId(id);
      await RltsService.deleteAllByUplineId(id);
      for (const children of deletedAccountChildren) {
        const directUpline = await RltsService.getDirectUpline(
          children.downlineId
        );
        if (!directUpline) continue;
        await RltsService.deleteAllByDownlineId(children.downlineId);
        await RltsService.addUplines(
          directUpline.uplineId,
          children.downlineId
        );
      }
      await this.deleteById(id);

      return {
        success: true,
        status: 200,
        data: true,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async getDownlinesAsUsers(id: number): Promise<TGenericResponse> {
    try {
      const downlines = await RltsService.getDownlinesAsUsers(id);
      const usersWithUplines = await Promise.all(
        downlines.map(async (downline) => await this.addUpline(downline))
      );
      return {
        success: true,
        status: 200,
        data: usersWithUplines,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async getUplinesAsUsers(id: number, limit = 1000): Promise<TGenericResponse> {
    try {
      const uplines = await RltsService.getUplinesAsUsers(id, limit);
      return {
        success: true,
        status: 200,
        data: uplines,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async getDirectUplineAsUser(id: number): Promise<TGenericResponse> {
    return await this.getUplinesAsUsers(id, 1);
  }

  async resetPassowrd(id: number): Promise<TGenericResponse> {
    try {
      const password = await getDefaultPass();
      const updated = await UserDTO.updatePassword(id, password);
      if (!updated) {
        return {
          success: false,
          status: 500,
          error: false,
        };
      }
      return {
        success: true,
        status: 200,
        data: true,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  async updatePassword(
    id: number,
    password: string
  ): Promise<TGenericResponse> {
    try {
      const hashedPassword = await hashPass(password);
      const updated = await UserDTO.updatePassword(id, hashedPassword);
      if (!updated) {
        return {
          success: false,
          status: 500,
          error: false,
        };
      }
      return {
        success: true,
        status: 200,
        data: true,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: error.message,
      };
    }
  }

  /*
  *** START REGION
  --------------------------------------- GENERIC METHODS ONE LINERS --------------------------------------
  */
  async checkDownlinesUpline(
    uplineId: number,
    childrenIds: number[]
  ): Promise<boolean> {
    let areValid = true;
    for (const childId of childrenIds) {
      const rlt = await RltsService.getDirectUpline(childId);
      if (rlt?.uplineId !== uplineId) {
        return false;
      }
    }
    return areValid;
  }

  async deleteById(id: number): Promise<boolean> {
    return await UserDTO.deleteById(id);
  }

  async insert(args: UserInsertDTO): Promise<UserGetDTO> {
    return await UserDTO.insert(args);
  }

  async validateResetToken(userId: number, token: string): Promise<TGenericResponse> {
    try {
      const user = await UserDTO.getById(userId);
      
      if (!user || user.resetToken !== token || Date.now() > (user.resetTokenExpiry || 0)) {
        return {
          success: false,
          status: 400,
          error: "Invalid or expired token",
        };
      }
  
      return {
        success: true,
        status: 200,
        data: "Token is valid",
      };
    } catch (error: any) {
      return { success: false, status: 500, error: error.message };
    }
  }
  /*
  *** ################################### END REGION                #######################################
  --------------------------------------- GENERIC METHODS ONE LINERS --------------------------------------
  *** ################################### END REGION                #######################################
  *** ################################### END REGION                #######################################
  *** ################################### END REGION                #######################################
  */
}

export default new UserService();
