import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../utils/database";
import {
  GroupLevelGetDTO,
  GroupLevelInsertDTO,
} from "../utils/types/TGroupLevels";

class GroupLevelsDTO {
  constructor() {}

  async findAll(
    queryText: string,
    args: (string | number)[]
  ): Promise<GroupLevelGetDTO[]> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows as GroupLevelGetDTO[];
  }

  async findFirst(
    queryText: string,
    args: (string | number)[]
  ): Promise<GroupLevelGetDTO> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows[0] as GroupLevelGetDTO;
  }

  async getAllByGroupId(id: number): Promise<GroupLevelGetDTO[]> {
    const queryString = `
      SELECT groupLevels.*
      FROM groupLevels
      INNER JOIN groupsTable
      ON groupLevels.groupId = groupsTable.id
      WHERE groupsTable.id = ?
    `;
    return await this.findAll(queryString, [id]);
  }

  constructInserString(args: GroupLevelInsertDTO[]): string {
    let initialString = `
    INSERT INTO groupLevels (groupId, levelIndex, commissionChunk)
    VALUES  
    `;
    args.forEach((_, index) => {
      if (index === args.length - 1) {
        initialString += `(?, ?, ?)`;
      } else {
        initialString += `(?, ?, ?),`;
      }
    });
    return initialString;
  }

  async getGroupLevelsCount(groupId: number): Promise<number> {
    const results = await this.getAllByGroupId(groupId);
    return results.length;
  }

  async insert(
    groupId: number,
    args: GroupLevelInsertDTO[]
  ): Promise<GroupLevelGetDTO[]> {
    const queryString = this.constructInserString(args);
    const insertArray: number[] = [];
    args.map((item) => {
      insertArray.push(groupId);
      insertArray.push(item.levelIndex);
      insertArray.push(item.commissionChunk);
    });
    await pool.query<ResultSetHeader>(queryString, insertArray);
    return await this.getAllByGroupId(groupId);
  }

  async deleteByGroupId(id: number): Promise<boolean> {
    const queryString = `
          DELETE FROM groupLevels
          WHERE groupId = ?
      `;
    await pool.query<ResultSetHeader>(queryString, [id]);
    const exists = await this.getAllByGroupId(id);
    if (!exists || !exists.length) return true;
    return false;
  }
}

export default new GroupLevelsDTO();
