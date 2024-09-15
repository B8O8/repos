import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../utils/database";
import { UserGetDTO, UserInsertDTO, UserUpdateDTO } from "../utils/types/TUser";
import { TCommissionRecordSet } from "../utils/types/TCommission";

class CommissionRecordDTO {
  constructor() {}

  async insert(args: TCommissionRecordSet): Promise<UserGetDTO[]> {
    const queryText = `
        INSERT INTO commissionRecords 
        (email, firstName, lastName, phone, country, isVerified, md5Id, totalTradedLots, lots, 
        balanceUsd, equityUSD, commissionUSD, plClosedUsd, depositsUSD, withdrawalsUSD, netDepositsUSD, commissionDate, dispensedCommissionUSD) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      args?.dispensedCommissionUSD || null,
      args?.userCashoutUSD || null,
    ]);
    return rows as UserGetDTO[];
  }
}

export default new CommissionRecordDTO();
