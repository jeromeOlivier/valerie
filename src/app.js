/**
 * This variable represents a module that provides a framework for building web applications in Node.js.
 * It encapsulates various HTTP utility methods and middleware for handling HTTP requests and responses.
 *
 * @module express
 * @requires express
 */

// external dependencies
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
// internal dependencies
const routes = require("./routes/index");
const { log } = require("util");
const db = require("./db_ops/db");
const shutDown = require("./db_ops/shutdown");

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
            scriptSrc: [
                "'self'",
                "https://checkout.stripe.com/",
                "'unsafe-inline'"
            ],
            connectSrc: ["'self'", "https://checkout.stripe.com/"],
            frameSrc: ["'self'", "https://checkout.stripe.com/"],
        },
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// routes
app.use("/", routes);

// db shutdown on process exit
process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

// initialize server
const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => console.log(`Server running on port ${ port }`));
// path: src/app.js
