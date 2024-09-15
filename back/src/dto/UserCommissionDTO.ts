import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../utils/database";
import { UserGetDTO, UserInsertDTO, UserUpdateDTO } from "../utils/types/TUser";
import {
  TCommissionRecordSet,
  TUserCommissionGet,
  TUserCommissionSet,
} from "../utils/types/TCommission";

class UserCommissionDTO {
  constructor() {}

  async insertUserCommissions(records: TUserCommissionSet[]) {
    const queryText = `
      INSERT INTO userCommission 
      (downlineId, uplineId, commissionValue, totalTradedLots, date, uplineCommissionChunk, charged, dispensed, commissionUSD) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await Promise.all(
      records.map(async (record) => {
        await pool.query<RowDataPacket[]>(queryText, [
          record.downlineId,
          record.uplineId,
          record.commissionValue,
          record.totalTradedLots || null,
          record.date,
          record.uplineCommissionChunk,
          record.charged,
          record.dispensed,
          record.commissionUSD,
        ]);
      })
    );
    return true;
  }

  async getByTimeInterval(
    from: string,
    to: string
  ): Promise<TUserCommissionGet[]> {
    const queryText = `
    SELECT userCommission.*
    FROM userCommission
    WHERE userCommission.date BETWEEN ? AND ?
    `;
    const [rows] = await pool.query<RowDataPacket[]>(queryText, [from, to]);
    return rows as TUserCommissionGet[];
  }

  async getByUplineIdInTimeInterval(
    userId: number,
    from: string,
    to: string
  ): Promise<TUserCommissionGet[]> {
    const queryText = `
    SELECT 
  userCommission.*,
  users.email AS downlineEmail,
  users.firstName AS downlineFirstName,
  users.lastName AS downlineLastName,
  users.md5Id AS downlineMd5Id,
  relationships.level
FROM userCommission
JOIN users ON userCommission.downlineId = users.id
LEFT JOIN relationships 
ON userCommission.uplineId = relationships.uplineId
AND userCommission.downlineId = relationships.downlineId
WHERE userCommission.uplineId = ?
AND userCommission.date BETWEEN ? AND ?
  AND (relationships.level IS NOT NULL OR userCommission.downlineId = userCommission.uplineId)
    `;
    const [rows] = await pool.query<RowDataPacket[]>(queryText, [
      userId,
      from,
      to,
    ]);
    return rows as TUserCommissionGet[];
  }

  async getAll(): Promise<TUserCommissionGet[]> {
    const queryText = `
    SELECT 
      userCommission.*,
      downlineUser.email AS downlineEmail,
      downlineUser.firstName AS downlineFirstName,
      downlineUser.lastName AS downlineLastName,
      downlineUser.md5Id AS downlineMd5Id,
      uplineUser.email AS uplineEmail,
      uplineUser.firstName AS uplineFirstName,
      uplineUser.lastName AS uplineLastName,
      uplineUser.md5Id AS uplineMd5Id
    FROM userCommission
    LEFT JOIN users AS downlineUser ON userCommission.downlineId = downlineUser.id
    LEFT JOIN users AS uplineUser ON userCommission.uplineId = uplineUser.id
    ORDER BY userCommission.date DESC
    LIMIT 500
    `;
    const [rows] = await pool.query<RowDataPacket[]>(queryText, []);
    return rows as TUserCommissionGet[];
  }

  async get(id: number): Promise<TUserCommissionGet[]> {
    const queryText = `
    SELECT 
    userCommission.*,
    downlineUser.email AS downlineEmail,
    downlineUser.firstName AS downlineFirstName,
    downlineUser.lastName AS downlineLastName,
    downlineUser.md5Id AS downlineMd5Id,
    uplineUser.email AS uplineEmail,
    uplineUser.firstName AS uplineFirstName,
    uplineUser.lastName AS uplineLastName,
    uplineUser.md5Id AS uplineMd5Id,
    relationships.level
  FROM userCommission
  LEFT JOIN users AS downlineUser ON userCommission.downlineId = downlineUser.id
  LEFT JOIN users AS uplineUser ON userCommission.uplineId = uplineUser.id
  LEFT JOIN relationships ON userCommission.uplineId = relationships.uplineId
                        AND userCommission.downlineId = relationships.downlineId
  WHERE userCommission.uplineId = ?
  ORDER BY userCommission.date DESC
  LIMIT 500;
  
    `;
    const [rows] = await pool.query<RowDataPacket[]>(queryText, [id]);
    return rows as TUserCommissionGet[];
  }

  async getByUplineId(
    userId: number,
    formattedDate: string
  ): Promise<TUserCommissionGet[]> {
    const queryText = `
    SELECT 
      userCommission.*,
      users.email AS downlineEmail,
      users.firstName AS downlineFirstName,
      users.lastName AS downlineLastName,
      users.md5Id AS downlineMd5Id,
      relationships.level
    FROM userCommission
    JOIN users ON userCommission.downlineId = users.id
    JOIN relationships 
    ON userCommission.uplineId = relationships.uplineId
    AND userCommission.downlineId = relationships.downlineId
    WHERE userCommission.uplineId = ?
    AND userCommission.date = ?
    `;
    const [rows] = await pool.query<RowDataPacket[]>(queryText, [
      userId,
      formattedDate,
    ]);
    return rows as TUserCommissionGet[];
  }

  async getByUplineIdInTimeRange(
    uplineId: number,
    startDate: string,
    endDate: string
  ): Promise<TUserCommissionGet[]> {
    const queryText = `
    SELECT 
    userCommission.*,
    users.email AS downlineEmail,
    users.firstName AS downlineFirstName,
    users.lastName AS downlineLastName,
    users.md5Id AS downlineMd5Id,
    relationships.level
  FROM userCommission
  JOIN users ON userCommission.downlineId = users.id
  LEFT JOIN relationships 
  ON userCommission.uplineId = relationships.uplineId
  AND userCommission.downlineId = relationships.downlineId
  WHERE userCommission.uplineId = ?
  AND userCommission.date BETWEEN ? AND ?
  AND (relationships.level IS NOT NULL OR userCommission.downlineId = userCommission.uplineId)
  
    `;
    const [rows] = await pool.query<RowDataPacket[]>(queryText, [
      uplineId,
      startDate,
      endDate,
    ]);
    return rows as TUserCommissionGet[];
  }

  async insert(args: TCommissionRecordSet): Promise<UserGetDTO[]> {
    const queryText = `
        INSERT INTO commissionRecords 
        (email, firstName, lastName, phone, country, isVerified, md5Id, totalTradedLots, lots, 
        balanceUsd, equityUSD, commissionUSD, plClosedUsd, depositsUSD, withdrawalsUSD, netDepositsUSD, commissionDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [rows] = await pool.query<RowDataPacket[]>(queryText, [
      args?.email || null,
      args?.firstName || null,
      args?.lastName || null,
      args?.phone || null,
      args?.country || null,
      args?.isVerified || null,
      args?.md5Id,
      args?.totalTradedLots || null,
      args?.lots || null,
      args?.balanceUsd || null,
      args?.equityUSD || null,
      args?.commissionUSD || null,
      args?.plClosedUsd || null,
      args?.depositsUSD || null,
      args?.withdrawalsUSD || null,
      args?.netDepositsUSD || null,
      args?.commissionDate || null,
    ]);
    return rows as UserGetDTO[];
  }
}

export default new UserCommissionDTO();
