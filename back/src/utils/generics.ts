import bcrypt from "bcrypt";
import { IUserGet, IUserSet, IUserWithPassword } from "./types/IUserTypes";
import { ICommission } from "./types/ICommissionTypes";
import { Request, Response } from "express";
import { IRequestUser } from "./types/IRequestTypes";
import { TGenericResponse } from "./types/IGenerics";

export const getDefaultPass = async () => {
  return await hashPass("123123");
};

export const hashPass = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const asUserGet = (args: IUserGet): IUserGet => {
  const {
    email,
    firstName,
    id,
    isAdmin,
    lastName,
    phoneNumber,
    md5Id,
    username,
  }: IUserGet = args;
  return {
    id,
    md5Id,
    email,
    username,
    firstName,
    lastName,
    phoneNumber,
    isAdmin,
  };
};

export const asUserGetWithPassword = (
  args: IUserWithPassword
): IUserWithPassword => {
  const { id, md5Id, password, isAdmin }: IUserWithPassword = args;
  return {
    id,
    md5Id,
    password,
    isAdmin,
  };
};

export const asICommission = (
  args: any,
  commissionDate: Date
): ICommission | undefined => {
  if (
    !args["Email"] ||
    !args["Account Logins"] ||
    isNaN(parseInt(args["Account Logins"]))
  )
    return undefined;
  const email = args["Email"];
  const firstName = args["First Name"];
  const lastName = args["Last Name"];
  const phone = args["Phone"];
  const country = args["Country"];
  const isVerified = args["Is Verified"];
  const md5Id = args["Account Logins"];
  const totalTradedLots = args["Total Traded Lots"];
  const lots = args["Lots"];
  const balanceUsd = args["Balance, USD"];
  const equityUsd = args["Equity, USD"];
  const commissionUsd = args["Commission, USD"];
  const plClosedUsd = args["P/L Closed, USD"];
  const depositsUsd = args["Deposits, USD"];
  const withdrawalsUsd = args["Withdrawals, USD"];
  const netDepositsUsd = args["Net Deposits, USD"];
  return {
    email,
    firstName,
    lastName,
    phone,
    country,
    isVerified,
    md5Id,
    totalTradedLots,
    lots,
    balanceUsd,
    equityUsd,
    commissionUsd,
    plClosedUsd,
    depositsUsd,
    withdrawalsUsd,
    netDepositsUsd,
    commissionDate,
  };
};

export const getTokenDataFromRequest = (req: Request): IRequestUser => {
  const userId = req.userId;
  const isAdmin = req.isAdmin;
  if (!userId) throw new Error("Unauthorized");
  return {
    userId,
    isAdmin,
  };
};

export const generateError = (
  res: Response,
  status: number,
  error: string
): any => {
  // Extract necessary information from the response object
  const { locals, headersSent } = res;
  const responseBody = { error };

  // Check if headers have been sent
  if (headersSent) {
    // If headers have been sent, send the response directly
    return res.status(status).json(responseBody);
  }

  // If headers have not been sent, modify the response and send it
  res.status(status).json(responseBody);
  // Optionally, you can restore the original locals if needed
  res.locals = locals;
  return res.end();
};

export const handleCatchError = (error: any): TGenericResponse => {
  return {
    status: 500,
    error: error.message || "An Error occured",
    success: false,
  };
};

export const handleResponse = (response: TGenericResponse, res: Response) => {
  if (response.success) return res.status(response.status).json(response.data);
  return res.status(response.status).json(response.error);
};

export const handleUnauthenticated = (res: Response) => {
  return res.status(401).json({ error: "Unauthorized" });
};

export const asFormattedDate = (origin: any, withPlusOne = false): string => {
  try {
    if (withPlusOne) {
      let tomorrow = new Date(origin);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return new Date(tomorrow)?.toISOString()?.split("T")[0] || "";
    }
    return new Date(origin)?.toISOString()?.split("T")[0] || "";
  } catch (error: any) {
    return new Date()?.toISOString()?.split("T")[0];
  }
};
