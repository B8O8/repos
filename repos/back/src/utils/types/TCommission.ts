export type TCommissionRecordSet = {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  isVerified?: boolean;
  md5Id: string;
  totalTradedLots?: number;
  lots?: number;
  balanceUsd?: number;
  equityUSD?: number;
  commissionUSD?: number;
  plClosedUsd?: number;
  depositsUSD?: number;
  withdrawalsUSD?: number;
  netDepositsUSD?: number;
  commissionDate?: string; // Assuming you want to handle the date as a string
  dispensedCommissionUSD?: number;
  userCashoutUSD?: number;
};

export type TUserCommissionSet = {
  downlineId: number;
  uplineId: number;
  commissionValue: number;
  totalTradedLots?: number;
  date: string; // Assuming date is represented as a string
  uplineCommissionChunk: number;
  charged: number;
  dispensed: number;
  commissionUSD?: number;
};

export type TUserCommissionGet = {
  downlineId: number;
  uplineId: number;
  commissionValue: number;
  totalTradedLots?: number;
  date: string; // Assuming date is represented as a string
  uplineCommissionChunk: number;
  charged: number;
  commissionUSD?: number;
  uplineEmail?: string;
  downlineEmail?: string;
  downlineFirstName?: string;
  downlineLastName?: string;
  downlineMd5Id?: string;
  level: number;
};
