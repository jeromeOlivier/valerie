const express = require("express");
const router = express.Router();
const get = require("../handlers/get");
const post = require("../handlers/post");

// GET CONTENT WITH LAYOUT (whole page)
router.get("/", get.accueil);

// GET CONTENT WITHOUT LAYOUT (partial page)
router.get("/content_accueil", get.content_accueil);

module.exports = router;
