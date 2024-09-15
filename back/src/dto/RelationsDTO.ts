import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../utils/database";
import UserDTO from "./UserDTO";
import { UserGetDTO } from "../utils/types/TUser";
import { USER_GET_FIELDS } from "../utils/constants";

export type RltInsertDTO = {
  downlineId: number;
  uplineId: number;
  level: number;
  commissionChunk: number;
};

export type RltGetDTO = {
  downlineId: number;
  uplineId: number;
  level: number;
  commissionChunk: number;
  id?: number;
};

export type RltUpdateDTO = {
  uplineId: number;
  downlineId: number;
  commissionChunk: number;
};

export type RltUpdateWithChargedDTO = {
  charged: number;
  dispensed: number;
  cashout: number;
  relationships: RltUpdateDTO[];
};

class RelationsDTO {
  constructor() {}

  async findAll(
    queryText: string,
    args: (string | number)[]
  ): Promise<RltGetDTO[]> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows as RltGetDTO[];
  }

  async findFirst(
    queryText: string,
    args: (string | number)[]
  ): Promise<RltGetDTO> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows[0] as RltGetDTO;
  }

  async getById(id: number): Promise<RltGetDTO> {
    const queryString = `
        SELECT *
        FROM relationships
        WHERE id = ?
    `;
    return await this.findFirst(queryString, [id]);
  }

  async getDownlinesAsUsers(id: number, limit = 1000): Promise<UserGetDTO[]> {
    const queryString = `
      SELECT
        ${USER_GET_FIELDS},
        relationships.level as level,
        relationships.commissionChunk as commissionChunk,
        relationships.uplineId as uplineId
      FROM relationships
      INNER JOIN users
      ON relationships.downlineId = users.id
      WHERE relationships.uplineId = ?
      LIMIT ?
    `;
    return await UserDTO.findAll(queryString, [id, limit]);
  }

  async getUplinesAsUsers(id: number, limit: number): Promise<UserGetDTO[]> {
    const queryString = `
      SELECT
        ${USER_GET_FIELDS},
        relationships.level as level,
        relationships.commissionChunk as commissionChunk
      FROM relationships
      INNER JOIN users
      ON relationships.uplineId = users.id
      WHERE relationships.downlineId = ?
      LIMIT ?
    `;
    return await UserDTO.findAll(queryString, [id, limit]);
  }

  async getDownlines(id: number): Promise<RltGetDTO[]> {
    const queryString = `
        SELECT *
        FROM relationships
        WHERE uplineId = ?
        ORDER BY level ASC
    `;
    return await this.findAll(queryString, [id]);
  }

  async getUplines(id: number, limit = 10): Promise<RltGetDTO[]> {
    const queryString = `
        SELECT *
        FROM relationships
        WHERE downlineId = ?
        ORDER BY level ASC
        LIMIT ?
    `;
    return await this.findAll(queryString, [id, limit]);
  }

  async deleteById(id: number): Promise<boolean> {
    const queryString = `
        DELETE FROM relationships
        WHERE id = ?
    `;
    await pool.query<ResultSetHeader>(queryString, [id]);
    const exists = await this.getById(id);
    if (!exists) return true;
    return false;
  }

  async deleteAllByUplineId(id: number): Promise<boolean> {
    const queryString = `
        DELETE FROM relationships
        WHERE uplineId = ?
    `;
    await pool.query<ResultSetHeader>(queryString, [id]);
    const exists = await this.getDownlines(id);
    if (exists && exists.length) return false;
    return true;
  }

  async deleteAllByDownlineId(id: number): Promise<boolean> {
    const queryString = `
        DELETE FROM relationships
        WHERE downlineId = ?
    `;
    await pool.query<ResultSetHeader>(queryString, [id]);
    const exists = await this.getDownlines(id);
    if (exists && exists.length) return false;
    return true;
  }

  async updateById(updateArgs: RltUpdateDTO): Promise<UserGetDTO[]> {
    const queryString = `
      UPDATE relationships
      SET commissionChunk = ?
      WHERE downlineId = ? AND uplineId = ?    
    `;
    await pool.query<ResultSetHeader>(queryString, [
      updateArgs.commissionChunk,
      updateArgs.downlineId,
      updateArgs.uplineId,
    ]);
    return this.getDownlinesAsUsers(updateArgs.uplineId);
  }

  async insert(args: RltInsertDTO): Promise<RltGetDTO> {
    const queryString = `
        INSERT INTO relationships
        (uplineId, downlineId, level, commissionChunk)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query<ResultSetHeader>(queryString, [
      args.uplineId,
      args.downlineId,
      args.level,
      args.commissionChunk,
    ]);
    return await this.getById(result.insertId);
  }
}

export default new RelationsDTO();
