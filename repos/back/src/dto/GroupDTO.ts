import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../utils/database";
import { GroupGetDTO } from "../utils/types/TGroup";
import { GroupInsertDTO } from "../utils/types/TGroup";
import UserDTO from "./UserDTO";
import { UserGetDTO } from "../utils/types/TUser";
import { USER_GET_FIELDS } from "../utils/constants";

class GroupsDTO {
  constructor() {}

  async findAll(
    queryText: string,
    args: (string | number)[]
  ): Promise<GroupGetDTO[]> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows as GroupGetDTO[];
  }

  async findFirst(
    queryText: string,
    args: (string | number)[]
  ): Promise<GroupGetDTO> {
    const [rows] = await pool.query<RowDataPacket[]>(queryText, args);
    return rows[0] as GroupGetDTO;
  }

  async getById(id: number): Promise<GroupGetDTO> {
    const queryString = `SELECT * FROM groupsTable WHERE id = ?`;
    return await this.findFirst(queryString, [id]);
  }

  async getByName(name: string): Promise<GroupGetDTO> {
    const queryString = `SELECT * FROM groupsTable WHERE name = ?`;
    return await this.findFirst(queryString, [name]);
  }

  async getAll(): Promise<GroupGetDTO[]> {
    const queryString = `SELECT * FROM groupsTable`;
    return await this.findAll(queryString, []);
  }

  async getAllUsersByGroupId(id: number, limit: number): Promise<UserGetDTO[]> {
    const queryString = `
      SELECT
        ${USER_GET_FIELDS}
      FROM usergroup
      INNER JOIN users
      ON usergroup.userId = users.id
      WHERE usergroup.groupId = ?
      LIMIT ?
    `;
    return await UserDTO.findAll(queryString, [id, limit]);
  }

  async insert(args: GroupInsertDTO): Promise<GroupGetDTO> {
    const queryString = `
    INSERT INTO groupsTable (name, totalCommission, dispensedCommission)
    VALUES (?, ?, ?) 
    `;
    await pool.query<ResultSetHeader>(queryString, [
      args.name,
      args.totalCommission,
      args.dispensedCommission,
    ]);
    return await this.getByName(args.name);
  }

  async updateById(
    id: number,
    updateArgs: GroupInsertDTO
  ): Promise<GroupGetDTO> {
    const queryString = `
            UPDATE users
            SET name=?,totalCommission=?,dispensedCommission=?
            WHERE id = ?
        `;
    await pool.query<ResultSetHeader>(queryString, [
      updateArgs.name,
      updateArgs.totalCommission,
      updateArgs.dispensedCommission,
      id,
    ]);
    return this.getById(id);
  }
}

export default new GroupsDTO();
