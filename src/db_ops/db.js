const mysql = require("mysql2");

/**
 * @description Represents a database connection pool.
 *
 * @typedef {Object} DBConnectionPool
 * @property {function} query - The function used to execute a SQL query on the database.
 * @property {function} end - The function used to close the database connection pool.
 */
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
// path: src/services/db.js
