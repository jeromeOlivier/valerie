// purpose: main entry point for the application
// external dependencies
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
require("dotenv").config();
const path = require("path");
// internal dependencies
const routes = require("./routes/index");
const { log } = require("util");
const db = require("./utils/database");

// initialize express app
const app = express();

async function getCustomers() {
  const [rows] = await db.query("SELECT * FROM customers");
  return rows;
}

async function logCustomers()

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// configure middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://checkout.stripe.com/"],
      connectSrc: ["'self'", "https://checkout.stripe.com/"],
      frameSrc: ["'self'", "https://checkout.stripe.com/"],
    },
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", routes);

// initialize server
const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => console.log(`Server running on port ${port}`));
// path: src/app.js
