import { Request, Response } from "express";
import GroupDTO from "../dto/GroupDTO";
import GroupLevelsDTO from "../dto/GroupLevelsDTO";
import { GroupInsertDTO } from "../utils/types/TGroup";
import { TGenericResponse } from "../utils/types/IGenerics";
import { GroupLevelGetDTO } from "../utils/types/TGroupLevels";

class GroupService {
  async getLevelsCount(id: number): Promise<TGenericResponse> {
    try {
      const count = await GroupLevelsDTO.getGroupLevelsCount(id);
      return {
        success: true,
        status: 200,
        data: count,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || "An error occured",
      };
    }
  }
  async createGroupLevels(
    id: number,
    levels: GroupLevelGetDTO[]
  ): Promise<TGenericResponse> {
    try {
      const groupLevels = await GroupLevelsDTO.insert(id, levels);
      return {
        success: true,
        status: 200,
        data: groupLevels,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || "An error occured",
      };
    }
  }

  async getAllUsersByGroupId(id: number): Promise<TGenericResponse> {
    try {
      const users = await GroupDTO.getAllUsersByGroupId(id, 1000);
      return {
        success: true,
        status: 200,
        data: users,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || "An error occured",
      };
    }
  }

  async getGroupByName(name: string): Promise<TGenericResponse> {
    try {
      const group = await GroupDTO.getByName(name);
      if (!group) {
        return {
          success: false,
          status: 500,
          error: "Group with this name does not exist",
        };
      }
      return {
        success: true,
        status: 200,
        data: group,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || "An error occured",
      };
    }
  }

  async getGroupById(id: number): Promise<TGenericResponse> {
    try {
      const group = await GroupDTO.getById(id);
      if (!group) {
        return {
          success: false,
          status: 500,
          error: "Group with this id does not exist",
        };
      }
      return {
        success: true,
        status: 200,
        data: group,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || "An error occured",
      };
    }
  }

  async createGroup(args: GroupInsertDTO): Promise<TGenericResponse> {
    try {
      const collides = await this.checkIfCollides(args.name);
      if (args.dispensedCommission > args.totalCommission) {
        return {
          success: false,
          status: 400,
          error: "Dispensed commission cannot be greater than total commission",
        };
      }
      if (collides) {
        return {
          success: false,
          status: 400,
          error: "Group with same name already exists",
        };
      }
      const group = await GroupDTO.insert(args);
      return {
        success: true,
        status: 201,
        data: group,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || "An error occured",
      };
    }
  }

  async getAllGroups(): Promise<TGenericResponse> {
    try {
      const groupsTable = await GroupDTO.getAll();
      return {
        success: true,
        status: 200,
        data: groupsTable,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || "An error occured",
      };
    }
  }

  // ####################### BEGIN ####################################
  // GENERIC FUNCTION
  async checkIfCollides(name: string): Promise<boolean> {
    const group = await GroupDTO.getByName(name);
    if (group) return true;
    return false;
  }
}

export default new GroupService();
