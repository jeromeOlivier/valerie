// purpose: main entry point for the application
// external dependencies
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cookie = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
// internal dependencies
const routes = require("./routes/index");
const { log } = require("util");
const db = require("./utils/database");

// initialize express app
const app = express();

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// configure middleware
app.use(compression());
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(cookie({
  maxAge: 1000 * 60 * 60 * 24 * 7,
  httpOnly: false,
  sameSite: "strict",
}));

// routes
app.use("/", routes);

// initialize server
const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => console.log(`Server running on port ${port}`));
// path: src/app.js
