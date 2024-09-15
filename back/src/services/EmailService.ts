import nodemailer from "nodemailer";
import Imap from "imap";

import { TUserCommissionGet } from "../utils/types/TCommission";
import { asFormattedDate } from "../utils/generics";

const imapServer = "imap.titan.email";
const imapPort = 993;

const smtpServer = "smtp.titan.email";
const smtpPort = 587;
const senderEmail = "info@masari.me";
const senderPassword = "1272021Ahmad$$$";

const configuration = {
  host: smtpServer,
  port: smtpPort,
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
};

const constructCommissionMonthlyEmail = (
  username: string,
  from: string,
  to: string,
  commissions: TUserCommissionGet[],
  totalCommission: number,
  userCashoutValue: number // Accept userCashoutValue as a parameter
): string => {
  // Sort the commissions if needed
  const sortedCommissions = commissions.sort((a, b) => a.level - b.level);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email with Table</title>
        <style>
        body {
            font-family: Arial, sans-serif;
        }
    
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
    
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
    
        th {
            background-color: #f2f2f2;
        }
    
        .subrow {
            margin-left: 20px;
            font-style: italic;
        }
        </style>
    </head>
    <body>
        <h1>Commission</h1>
        <p>Hello ${username},</p>
        <p>This is your commission for the period between ${from} -> ${to}:</p>
    
        <table>
        <thead>
            <tr>
            <th>Date</th>
            <th>Level</th>
            <th>Fullname</th>
            <th>MT5 ID</th>
            <th>My Commission</th>
            </tr>
        </thead>
        <tbody>
            ${
              userCashoutValue > 0
                ? `
                <tr>
                <td>-</td>
                <td>Cashout</td>
                <td>${username}</td>
                <td>-</td>
                <td>${userCashoutValue}</td>
                </tr>
              `
                : ""
            }
            ${sortedCommissions
              .map((commission: TUserCommissionGet) => {
                if (!commission.commissionValue) return "";
                return `
                <tr>
                <td>${asFormattedDate(commission.date)}</td>
                <td>${commission.level}</td>
                <td>${
                  (commission.downlineFirstName || "") +
                  " " +
                  (commission.downlineLastName || "")
                }</td>
                <td>${commission.downlineMd5Id || ""}</td>
                <td>${commission.commissionValue || ""}</td>
                </tr>
                `;
              })
              .join("")}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Total: </td>
              <td>${totalCommission}</td>
            </tr>
        </tbody>
        </table>
    
        <p>Best regards,<br><br><br>MASARI ADMINISTRATION</p>
    </body>
  </html>
  `;
};


const constructCommissionDailyEmail = (
  username: string,
  date: string,
  commissions: TUserCommissionGet[],
  totalCommission: number,
  userCashoutValue: number // Accept userCashoutValue as a parameter
): string => {
  // Sort the commissions if needed
  const sortedCommissions = commissions.sort((a, b) => a.level - b.level);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email with Table</title>
        <style>
        body {
            font-family: Arial, sans-serif;
        }
    
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
    
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
    
        th {
            background-color: #f2f2f2;
        }
    
        .subrow {
            margin-left: 20px;
            font-style: italic;
        }
        </style>
    </head>
    <body>
        <h1>Commission</h1>
        <p>Hello ${username},</p>
        <p>This is your commission for ${date}:</p>
    
        <table>
        <thead>
            <tr>
            <th>Level</th>
            <th>Fullname</th>
            <th>MT5 ID</th>
            <th>My Commission</th>
            </tr>
        </thead>
        <tbody>
            ${
              userCashoutValue > 0
                ? `
                <tr>
                <td>Cashout</td>
                <td>${username}</td>
                <td>-</td>
                <td>${userCashoutValue}</td>
                </tr>
              `
                : ""
            }
            ${sortedCommissions
              .map((commission: TUserCommissionGet) => {
                if (!commission.commissionValue) return "";
                return `
                <tr>
                <td>${commission.level}</td>
                <td>${
                  (commission.downlineFirstName || "") +
                  " " +
                  (commission.downlineLastName || "")
                }</td>
                <td>${commission.downlineMd5Id || ""}</td>
                <td>${commission.commissionValue || ""}</td>
                </tr>
                `;
              })
              .join("")}
            <tr>
              <td></td>
              <td></td>
              <td>Total: </td>
              <td>${totalCommission}</td>
            </tr>
        </tbody>
        </table>
    
        <p>Best regards,<br><br><br>MASARI ADMINISTRATION</p>
    </body>
  </html>
  `;
};


const transporter = nodemailer.createTransport(configuration);

class EmailService {
  async send(mailOptions: any, date: string) {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email: ");
        console.log(err);
        return;
      }
      const imap = new Imap({
        user: senderEmail,
        password: senderPassword,
        host: imapServer,
        port: imapPort,
        tls: true,
      });
      imap.once("ready", () => {
        imap.openBox("Sent", true, (err: any) => {
          if (err) {
            console.error('Error opening "Sent" folder:', err);
            imap.end();
            return;
          }

          // Create the email message as MIMEText
          const emailMessage = `
                  To: ${mailOptions.to}\r\n
                  Subject: Commissions for ${date}\r\n\r\n
                  ${mailOptions.html}
              `;

          // Append the sent email to the "Sent" folder
          imap.append(emailMessage, { mailbox: "Sent" }, (appendErr: any) => {
            if (appendErr) {
              console.error(
                'Error appending email to "Sent" folder:',
                appendErr
              );
            } else {
              console.log('Email appended to "Sent" folder.');
            }
            imap.end();
            return true;
          });
        });
      });

      imap.once("error", (imapErr: any) => {
        console.error("IMAP Error:", imapErr);
        return false;
      });

      imap.connect();
    });
  }

  // reset password email
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const mailOptions = {
      subject: `Password Reset Request`,
      from: senderEmail,
      to: email,
      html: `
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>You requested to reset your password. Please click the link below to reset it:</p>
        <a href="${resetLink}">Reset your password</a>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>Best regards,<br>MASARI ADMINISTRATION</p>
      `,
    };

    try {
      await this.send(mailOptions, "Password Reset");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  }

  async sendMonthlyCommissionEmail(
    email: string,
    username: string,
    from: string,
    to: string,
    commissions: TUserCommissionGet[],
    userCashout: number // Pass userCashout as an argument
  ): Promise<void> {
    if (!commissions.length) return;
  
    try {
      const totalCommission = commissions.reduce((accumulator, currentValue) => {
        return (
          accumulator + (parseFloat(currentValue.commissionValue.toString()) || 0)
        );
      }, userCashout); // Add userCashout to the total commission
  
      const mailOptions = {
        subject: `Commissions for period between ${from} -> ${to}`,
        from: senderEmail,
        to: email,
        html: constructCommissionMonthlyEmail(
          username,
          from,
          to,
          commissions,
          totalCommission,
          userCashout // Pass userCashout to the email construction
        ),
      };
  
      this.send(mailOptions, `${from} -> ${to}`);
    } catch (error) {
      console.log("Error sending email for: ", email);
      console.log(error);
    }
  }
  

  async sendDailyCommissionEmail(
    email: string,
    username: string,
    commissions: TUserCommissionGet[],
    userCashout: number // Pass userCashout as an argument
  ): Promise<void> {
    try {
      if (!commissions.length) return;
  
      const date = asFormattedDate(commissions[0].date);
      const totalCommission = commissions.reduce((accumulator, currentValue) => {
        return (
          accumulator +
          (parseFloat(currentValue.commissionValue.toString()) || 0)
        );
      }, userCashout); // Add userCashout to the total commission
  
      const mailOptions = {
        subject: `Commissions for ${date}`,
        from: senderEmail,
        to: email,
        html: constructCommissionDailyEmail(
          username,
          date,
          commissions,
          totalCommission,
          userCashout // Pass userCashout to the email construction
        ),
      };
  
      await this.send(mailOptions, date);
    } catch (error) {
      console.log("Error sending email to: ", email);
      console.log(error);
    }
  }
  
}
export default new EmailService();
