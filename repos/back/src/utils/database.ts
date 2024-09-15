import mysql from "mysql2";

export const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "masari",
  })
  .promise();

const log = async () => {
  console.log("connected !");
};

log();
