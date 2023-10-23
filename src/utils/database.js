const mysql = require("mysql2");

const db = mysql
  .createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    password: process.env.MYSQLPASSWORD,
    connectTimeout: 60000,
  })
  .promise();

module.exports = db;
// path: src/utils/database.js
