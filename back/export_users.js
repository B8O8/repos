const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "masari",
}).promise();

const exportData = async () => {
  try {
    await pool.query(`
      SELECT * 
      INTO OUTFILE '/exported_users.csv'
      FIELDS TERMINATED BY ',' 
      ENCLOSED BY '"'
      LINES TERMINATED BY '\n'
      FROM users;
    `);
    console.log("Data exported successfully to /exported_users.csv!");
  } catch (error) {
    console.error("Error exporting data:", error);
  }
};

exportData();
