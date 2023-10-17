const express = require("express");
const router = express.Router();
const validPages = require("../utils/validPages");
const get = require("../handlers/get");

validPages.forEach((p) => router.get(p.path, get.routeHandlers[p.path]));

module.exports = router;
// path: src/routes/index.js
