const config = {
  db: {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    password: process.env.MYSQLPASSWORD,
    connectTimeout: 60000,
  },
};

module.exports = config;
