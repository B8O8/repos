import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../utils/database";
import { GroupGetDTO } from "../utils/types/TGroup";
import { GroupInsertDTO } from "../utils/types/TGroup";
import UserDTO from "./UserDTO";
import { UserGetDTO } from "../utils/types/TUser";
import { USER_GET_FIELDS } from "../utils/constants";
import GroupDTO from "./GroupDTO";

export type UserGroupInsertDTO = {
  userId: number;
  groupId: number;
};

class UserGroupDTO {
  constructor() {}

  async getGroupByUserId(id: number): Promise<GroupGetDTO> {
    const queryString = `
        SELECT * FROM usergroup 
        INNER JOIN groupsTable 
        ON usergroup.groupId = groupsTable.id 
        WHERE usergroup.userId = ?
    `;
    return await GroupDTO.findFirst(queryString, [id]);
  }

  async insert(args: UserGroupInsertDTO): Promise<GroupGetDTO> {
    const queryString = `
    INSERT INTO usergroup (groupId, userId)
    VALUES (?, ?) 
    `;
    await pool.query<ResultSetHeader>(queryString, [args.groupId, args.userId]);
    return await this.getGroupByUserId(args.userId);
  }

  async delete(userId: number): Promise<boolean> {
    const queryString = `
        DELETE FROM usergroup
        WHERE userId = ?
    `;
    await pool.query<ResultSetHeader>(queryString, [userId]);
    const exists = await this.getGroupByUserId(userId);

    if (!exists) return true;
    return false;
  }
}

export default new UserGroupDTO();
