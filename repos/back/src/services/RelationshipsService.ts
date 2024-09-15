import { Request, Response } from "express";
import RltDTO, { RltGetDTO, RltInsertDTO } from "../dto/RelationsDTO";
import { UserGetDTO } from "../utils/types/TUser";
import GroupLevelsDTO from "../dto/GroupLevelsDTO";
import GroupDTO from "../dto/GroupDTO";
import UserGroupDTO from "../dto/UserGroupDTO";
import { GroupLevelGetDTO } from "../utils/types/TGroupLevels";
import UserDTO from "../dto/UserDTO";

const unshiftUpline = (
  uplines: RltInsertDTO[],
  upline: RltInsertDTO,
  downlineId: number
): RltGetDTO[] => {
  const updatedUplinesArray = uplines.map((p) => ({
    ...p,
    downlineId,
    level: p.level + 1,
  }));
  updatedUplinesArray.unshift(upline);
  return updatedUplinesArray;
};

class RltsSerivce {
  async getUplines(id: number): Promise<RltGetDTO[]> {
    return await RltDTO.getUplines(id);
  }

  async getDownlines(id: number): Promise<RltGetDTO[]> {
    return await RltDTO.getDownlines(id);
  }

  async getUplinesAsUsers(id: number, limit: number): Promise<UserGetDTO[]> {
    return await RltDTO.getUplinesAsUsers(id, limit);
  }

  async getDownlinesAsUsers(id: number): Promise<UserGetDTO[]> {
    return await RltDTO.getDownlinesAsUsers(id);
  }

  async getDirectUpline(downlineId: number): Promise<RltGetDTO | undefined> {
    const results = await this.getUplines(downlineId);
    return results[0];
  }

  getCommissionFromLevels(
    levels: GroupLevelGetDTO[],
    rltLevel: number,
    isHighAccount: boolean,
    dispensed: number
  ) {
    let commission: number = 0;
    if (isHighAccount) {
      let sum = 0;
      for (let i = 0; i < rltLevel - 1; i++) {
        sum += parseFloat(levels[i].commissionChunk.toString());
      }

      return dispensed - sum;
    }
    commission =
      levels.find((e) => e.levelIndex === rltLevel)?.commissionChunk || 0;
    return commission;
  }

  async addUplines(uplineId: number, downlineId: number): Promise<void> {
    try {
      const group = await UserGroupDTO.getGroupByUserId(uplineId);
      const levels = await GroupLevelsDTO.getAllByGroupId(group.id);
      const upline: RltInsertDTO = {
        uplineId,
        downlineId,
        commissionChunk: 0,
        level: 1,
      };
      const dispensed = (await UserDTO.getById(downlineId)).dispensed;
      let results = await this.getUplines(uplineId);
      results = unshiftUpline(results, upline, downlineId);
      results = results.slice(0, levels.length);
      const isHighAccount = results.length !== levels.length;
      results = results.map((result, index) => ({
        ...result,
        commissionChunk: this.getCommissionFromLevels(
          levels,
          result.level,
          isHighAccount && index === results.length - 1,
          dispensed
        ),
      }));
      await Promise.all(
        results.map(async (result) => await RltDTO.insert(result))
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async addUpline(args: RltInsertDTO): Promise<void> {
    await RltDTO.insert(args);
  }

  async deleteAllByDownlineId(downlineId: number) {
    await RltDTO.deleteAllByDownlineId(downlineId);
  }

  async deleteAllByUplineId(uplineId: number) {
    await RltDTO.deleteAllByUplineId(uplineId);
  }
}

export default new RltsSerivce();
