import { Readable } from "stream";
import { TGenericResponse } from "../utils/types/IGenerics";
import csvParser from "csv-parser";
import UserDTO from "../dto/UserDTO";
import {
  TCommissionRecordSet,
  TUserCommissionGet,
  TUserCommissionSet,
} from "../utils/types/TCommission";
import CommissionRecordDTO from "../dto/CommissionRecordDTO";
import RelationshipsService from "./RelationshipsService";
import UserCommissionDTO from "../dto/UserCommissionDTO";
import EmailService from "./EmailService";
import { asFormattedDate } from "../utils/generics";

class CommissionService {
  static normalizeRowData(
    row: any,
    date: string
  ): TCommissionRecordSet | undefined {
    if (row["Account Logins"]) {
      let originalKeys = [
        "Email",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Country",
        "Is Verified",
        "Account Logins",
        "Total Traded Lots",
        "Lots",
        "Balance, USD",
        "Equity, USD",
        "Commission, USD",
        "P/L Closed, USD",
        "Deposits, USD",
        "Withdrawals, USD",
        "Net Deposits, USD",
      ];
      let mappedKeys = [
        "email",
        "firstName",
        "lastName",
        "email",
        "phone",
        "country",
        "isVerified",
        "md5Id",
        "totalTradedLots",
        "lots",
        "balanceUsd",
        "equityUSD",
        "commissionUSD",
        "plClosedUsd",
        "depositsUSD",
        "withdrawalsUSD",
        "netDepositsUSD",
      ];
      const mappedRow: any = {};
      for (let i = 0; i < originalKeys.length; i++) {
        mappedRow[mappedKeys[i]] = row[originalKeys[i]];
      }
      mappedRow.commissionDate = date;
      return mappedRow as TCommissionRecordSet;
    }
    return undefined;
  }

  static async getAllUplinesThatGotCommission(
    from: string,
    to: string
  ): Promise<number[]> {
    const ids: number[] = [];
    const users = await UserCommissionDTO.getByTimeInterval(from, to);
    users.forEach((user) => {
      if (ids.includes(user.uplineId)) return;
      ids.push(user.uplineId);
    });
    return ids;
  }

  async getInTimeInterval(
    id: number,
    from: string,
    to: string
  ): Promise<TGenericResponse> {
    const userId = id;

    const commissions = await UserCommissionDTO.getByUplineIdInTimeInterval(
      userId,
      from,
      to
    );

    return {
      success: true,
      status: 200,
      data: commissions.map((e) => ({
        ...e,
        date: asFormattedDate(e.date, true),
      })),
    };
  }

  async getCommissions(
    userEmail: string,
    formattedDate: string
  ): Promise<TUserCommissionGet[]> {
    const user = await UserDTO.getByEmail(userEmail);
    const userId = user.id;
    const commissions = await UserCommissionDTO.getByUplineId(
      userId,
      formattedDate
    );
    return commissions;
  }

  async handleCsvUpload(buffer: string, date: Date): Promise<TGenericResponse> {
    const formattedDate = asFormattedDate(date, true);
    const stream = Readable.from(buffer);
    const rows: TCommissionRecordSet[] = [];
    
    stream
      .pipe(csvParser())
      .on("data", (row) => {
        const normalized = CommissionService.normalizeRowData(row, formattedDate);
        if (normalized) rows.push(normalized);
      })
      .on("end", async () => {
        const processedEmails: string[] = [];
  
        await Promise.all(
          rows.map(async (row) => {
            const email = row.email;
            const emailExists = await UserDTO.checkEmail(email);
            if (!emailExists) return;
  
            try {
              const user = await UserDTO.getByEmail(email);
              const dispensed = user.dispensed;
              const userId = user.id;
              const userCashout = user.cashout || 0; // Get cashout, default to 0
              const recordDispensedCommission =
                ((row?.commissionUSD || 0) * dispensed) / user.charged;
  
              // Calculate cashout value
              const userCashoutValue = (recordDispensedCommission * userCashout) / user.charged;
  
              // Insert the commission record for the user, including the cashout
              await CommissionRecordDTO.insert({
                ...row,
                dispensedCommissionUSD: recordDispensedCommission,
                userCashoutUSD: userCashoutValue,
              });
  
              const uplines = await RelationshipsService.getUplinesAsUsers(userId, 1000);
              const commissions: TUserCommissionSet[] = [];
  
              // Add user cashout as their own commission if applicable
              if (userCashout > 0) {
                commissions.push({
                  uplineId: userId,
                  downlineId: userId,
                  commissionValue: userCashoutValue,
                  date: formattedDate,
                  totalTradedLots: row.totalTradedLots || undefined,
                  charged: user.charged,
                  dispensed: dispensed,
                  uplineCommissionChunk: 1,
                  commissionUSD: row.commissionUSD,
                });
              }
  
              // Process uplines' commissions
              uplines.forEach((upline) => {
                if (recordDispensedCommission && upline.commissionChunk) {
                  const calculatedCommission =
                    (recordDispensedCommission * upline.commissionChunk) / dispensed;
  
                  commissions.push({
                    uplineId: upline.id,
                    downlineId: userId,
                    commissionValue: calculatedCommission,
                    date: formattedDate,
                    totalTradedLots: row.totalTradedLots || undefined,
                    charged: user.charged,
                    dispensed: dispensed,
                    uplineCommissionChunk: upline.commissionChunk,
                    commissionUSD: row.commissionUSD,
                  });
                }
              });
  
              // Insert all commissions (user + uplines)
              await UserCommissionDTO.insertUserCommissions(commissions);
  
              // If email not already processed, send one combined email
              if (!processedEmails.includes(user.email)) {
                const userCommissions = await this.getCommissions(user.email, formattedDate);
                await EmailService.sendDailyCommissionEmail(
                  user.email,
                  user.username,
                  userCommissions,
                  userCashoutValue // Include the user's cashout if applicable
                );
                processedEmails.push(user.email); // Mark email as processed
              }
  
            } catch (error) {
              console.error("Error processing row:", error);
            }
          })
        );
      });
  
    return {
      success: true,
      status: 200,
      data: "ok",
    };
  }

  async getAll(): Promise<TGenericResponse> {
    const commissions = await UserCommissionDTO.getAll();
    return {
      success: true,
      status: 200,
      data: commissions,
    };
  }

  // async handleCsvTest(buffer: string): Promise<TGenericResponse> {
  //   const stream = Readable.from(buffer);
  //   const rows: { Level: string; Email: string }[] = []; // Store levels and emails from the CSV
  //   const nonExistentUsers: string[] = [];

  //   // Function to clean the keys (removes all whitespace and trims)
  //   function cleanKey(key: string): string {
  //     return key.replace(/\s+/g, "").trim();
  //   }

  //   await new Promise<void>((resolve, reject) => {
  //     stream
  //       .pipe(csvParser())

  //       .on("data", (row: Record<string, string>) => {
  //         // Access the cleaned keys explicitly, ensuring correct mapping
  //         const levelKey = cleanKey("Level");
  //         const emailKey = cleanKey("Email");

  //         const level = row[levelKey] || row[Object.keys(row)[0]]; // Fallback if Level is missing
  //         const email = row[emailKey];

  //         if (email) {
  //           rows.push({ Level: level, Email: email });
  //         }
  //       })
  //       .on("end", async () => {
  //         for (const { Level, Email } of rows) {
  //           if (Level === "direct") {
  //             const emailExists = await UserDTO.checkEmail(Email);
  //             if (!emailExists) {
  //               nonExistentUsers.push(Email);
  //             }
  //           }
  //         }
  //         resolve(); // Resolve when processing is complete
  //       })
  //       .on("error", (error: Error) => reject(error)); // Handle errors
  //   });

  //   return {
  //     success: true,
  //     status: 200,
  //     data: nonExistentUsers,
  //   };
  // }

  async handleCsvTest(buffer: string): Promise<TGenericResponse> {
    const stream = Readable.from(buffer);
    const rows: {
      Level: string;
      FirstName: string;
      LastName: string;
      Email: string;
      Phone: string;
      Country: string;
      IsVerified: string;
      AccountLogins: string;
      TotalTradedLots: string;
      Lots: string;
      BalanceUSD: string;
      EquityUSD: string;
      CommissionUSD: string;
      PLClosedUSD: string;
      DepositsUSD: string;
      WithdrawalsUSD: string;
      NetDepositsUSD: string;
      LastTradeDate: string;
    }[] = []; // Store all data from the CSV
    const nonExistentUsers: Record<string, string>[] = []; // Store all field data for non-existent users
  
    const cleanedHeaders: Record<string, string> = {}; // Store cleaned header mappings
  
    // Clean the keys from the CSV
    function cleanKey(key: string): string {
      return key.replace(/[^\w]/g, "").trim().toLowerCase();
    }
  
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on("headers", (headers: string[]) => {  // Specify the type of 'headers' as an array of strings
         
  
          // Create a mapping of cleaned headers to original headers
          headers.forEach((header: string) => {
            cleanedHeaders[cleanKey(header)] = header; // Map cleaned key to original key
          });
  
         
        })
        .on("data", (row: Record<string, string>) => {
          
  
          // Access the row values using cleaned headers
          const level = row[cleanedHeaders['level']];
          const firstName = row[cleanedHeaders['firstname']];
          const lastName = row[cleanedHeaders['lastname']];
          const email = row[cleanedHeaders['email']];
          const phone = row[cleanedHeaders['phone']];
          const country = row[cleanedHeaders['country']];
          const lots = row[cleanedHeaders['lots']];
          const balanceUSD = row[cleanedHeaders['balanceusd']];
          const accountLogins = row[cleanedHeaders['accountlogins']];
          const totalTradedLots = row[cleanedHeaders['totaltradedlots']];
          const equityUSD = row[cleanedHeaders['equityusd']];
          const commissionUSD = row[cleanedHeaders['commissionusd']];
          const plClosedUSD = row[cleanedHeaders['plclosedusd']];
          const depositsUSD = row[cleanedHeaders['depositsusd']];
          const withdrawalsUSD = row[cleanedHeaders['withdrawalsusd']];
          const netDepositsUSD = row[cleanedHeaders['netdepositsusd']];
          const lastTradeDate = row[cleanedHeaders['lasttradedate']];
          const isVerified = row[cleanedHeaders['isverified']];
  
        
  
          // Ensure all fields are captured, even if they are empty in the CSV
          rows.push({
            Level: level || "N/A",
            FirstName: firstName || "N/A",
            LastName: lastName || "N/A",
            Email: email || "N/A",
            Phone: phone || "N/A",
            Country: country || "N/A",
            Lots: lots || "0",
            AccountLogins: accountLogins || "0",
            TotalTradedLots: totalTradedLots || "0",
            BalanceUSD: balanceUSD || "0",
            EquityUSD: equityUSD || "0",
            CommissionUSD: commissionUSD || "0",
            PLClosedUSD: plClosedUSD || "0",
            DepositsUSD: depositsUSD || "0",
            WithdrawalsUSD: withdrawalsUSD || "0",
            NetDepositsUSD: netDepositsUSD || "0",
            LastTradeDate: lastTradeDate || "N/A",
            IsVerified: isVerified || "No",
          });
  
          
        })
        .on("end", async () => {
          
  
          for (const row of rows) {
            if (row.Level === "direct") {
              const emailExists = await UserDTO.checkEmail(row.Email);
              if (!emailExists) {
                // Push the entire row data for non-existent users
                nonExistentUsers.push(row);
              }
            }
          }
  
         
          resolve(); // Resolve when processing is complete
        })
        .on("error", (error: Error) => {
          
          reject(error);
        }); // Handle errors
    });
  
  
    return {
      success: true,
      status: 200,
      data: nonExistentUsers, // Return full data of non-existent users
    };
  }
  
  
  

  async get(id: number): Promise<TGenericResponse> {
    const commissions = await UserCommissionDTO.get(id);
    return {
      success: true,
      status: 200,
      data: commissions.map((e) => ({
        ...e,
        date: asFormattedDate(e.date, true),
      })),
    };
  }

  async sendMonthlyCommissionEmail(
    from: string,
    to: string
  ): Promise<TGenericResponse> {
    const allUplinesThatGotCommission = await CommissionService.getAllUplinesThatGotCommission(from, to);
  
    await Promise.all(
      allUplinesThatGotCommission.map(async (uplineId) => {
        try {
          const user = await UserDTO.getById(uplineId);
          
          // Get the user's own commissions (cashout + downline commissions)
          const commissions = await UserCommissionDTO.getByUplineIdInTimeInterval(
            user.id,
            from,
            to
          );
  
          // Check if the user has a cashout
          const userCashoutCommission = commissions.find(
            (commission) => commission.uplineId === commission.downlineId
          )?.commissionValue || 0;
  
          // Combine commissions with the user's own cashout (if applicable)
          await EmailService.sendMonthlyCommissionEmail(
            user.email,
            user.username,
            from,
            to,
            commissions,
            userCashoutCommission // Pass the user's cashout value
          );
        } catch (error) {
          console.log("Error occurred while sending monthly email", error);
        }
      })
    );
  
    return {
      success: true,
      status: 200,
      data: "ok",
    };
  }

  
  async getAllUsersCommissions(
    weekStart: string,
    weekEnd: string,
    monthStart: string,
    monthEnd: string
  ): Promise<TGenericResponse> {
    try {
      // Fetch all users
      const users = await UserDTO.getAll();
  
      // Prepare the data for each user (monthly and weekly commissions)
      const allUserCommissions = await Promise.all(
        users.map(async (user) => {
          // Get weekly commissions for this user
          const weeklyCommissions = await UserCommissionDTO.getByUplineIdInTimeRange(
            user.id,
            weekStart,
            weekEnd
          );
  
          // Get monthly commissions for this user
          const monthlyCommissions = await UserCommissionDTO.getByUplineIdInTimeRange(
            user.id,
            monthStart,
            monthEnd
          );
  
          // Sum up the commissions correctly (convert to number before summing)
          const totalWeeklyCommission = weeklyCommissions.reduce(
            (acc, curr) => acc + (typeof curr.commissionValue === "number" ? curr.commissionValue : parseFloat(curr.commissionValue) || 0),
            0
          );
  
          const totalMonthlyCommission = monthlyCommissions.reduce(
            (acc, curr) => acc + (typeof curr.commissionValue === "number" ? curr.commissionValue : parseFloat(curr.commissionValue) || 0),
            0
          );
  
          // Return the result for this user
          return {
            userId: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            weeklyCommission: totalWeeklyCommission, // Return the summed value as a number
            monthlyCommission: totalMonthlyCommission, // Return the summed value as a number
          };
        })
      );
  
      return {
        success: true,
        status: 200,
        data: allUserCommissions,
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        error: { message: "Error fetching commissions for users." },
        };
    }
  }
  
  
  
  
}
export default new CommissionService();
