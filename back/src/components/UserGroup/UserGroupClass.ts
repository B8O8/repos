// import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
// import { pool } from "../../utils/database";
// import { IUserGet } from "../../utils/types/IUserTypes";
// import UserDTO from "../User/UserClass";

// const userDto = new UserDTO();
// class UserGroupDTO {
//   constructor() {}

//   getAsUserGroupGetAdmin(row: RowDataPacket): IUserGroupGetAdmin {
//     return {
//         id: row.id,
//         dispensedCommission: row.dispensedCommission,
//         name: row.name,
//         superAdminCommission: row.superAdminCommission,
//         totalCommission: row.totalCommission,
//         totalUsersCount: row.totalUsers
//     }
//   }

//   getAsUserGroupGet(row: RowDataPacket): IUserGroupGet {
//     return {
//         id: row.id,
//         dispensedCommission: row.dispensedCommission,
//         name: row.name,
//     }
//   }

//   async getAllGroups(): Promise<IUserGroupGetAdmin[]> {
//     const queryString = `
//     SELECT
//     CG.id AS groupId,
//     CG.name AS groupName,
//     CG.totalCommission,
//     CG.superAdminCommission,
//     CG.dispensedCommission,
//     COUNT(UG.userId) AS totalUsers
//     FROM
//     CommissionGroups CG
//     LEFT JOIN
//     UserGroup UG ON CG.id = UG.groupId
//     GROUP BY
//     CG.id, CG.name, CG.totalCommission, CG.superAdminCommission, CG.dispensedCommission;

//     `;
//     const [rows] = await pool.query<RowDataPacket[]>(queryString);
//     return rows.map(row =>  this.getAsUserGroupGetAdmin(row))
//   }

//   async getGroupByUserId(userId: number): Promise<IUserGroupGet> {
//     const queryString = `
//         SELECT
//             CG.id AS groupId,
//             CG.name AS groupName,
//             CG.totalCommission,
//             CG.superAdminCommission,
//             CG.dispensedCommission
//         FROM
//             CommissionGroups CG
//         JOIN
//             UserGroup UG ON CG.id = UG.groupId
//         WHERE
//             UG.userId = ?;
//     `;
//     const [rows] = await pool.query<RowDataPacket[]>(queryString, [userId]);
//     return this.getAsUserGroupGet(rows[0])
//   }

//   async createGroup(groupArgs: IUserGroupSet): Promise<boolean> {
//     const queryString = `
//       INSERT INTO CommissionGroups (name, totalGroupCommission, superAdminCommission, dispensedCommission)
//       VALUES (?, ?, ?, ?);
//     `;
//     const [result] = await pool.query<ResultSetHeader>(queryString, [groupArgs.name, groupArgs.totalCommission, groupArgs.superAdminCommission, groupArgs.dispensedCommission]);
//     if (result.affectedRows === 1) return true
//     return false
//   }

//   async getAllUsersInGroup(id: number): Promise<IUserGet[]> {
//     const queryString = `
//     SELECT
//         U.id AS userId,
//         U.email,
//         U.username,
//         U.firstName,
//         U.lastName,
//         U.phoneNumber,
//         U.dob
//     FROM
//         Users U
//     JOIN
//         UserGroup UG ON U.id = UG.userId
//     WHERE
//         UG.groupId = ?;
//     `;

//     const [results] = await pool.query(queryString, [id]);
//     return results as IUserGet[]
//   }

// }

// export default UserGroupDTO;
