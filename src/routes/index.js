const express = require("express");
const router = express.Router();
const get = require("../handlers/get");
const post = require("../handlers/post");

// GET CONTENT WITH LAYOUT (whole page)
router.get("/", get.index);
router.get("blog", get.blog);
router.get("contact", get.contact);
router.get("excel", get.excel);
router.get("outlook", get.outlook);
router.get("panier", get.panier);
router.get("powerpoint", get.powerpoint);
router.get("service", get.service);
router.get("word", get.word);

// GET CONTENT WITHOUT LAYOUT (partial page)
router.get("/data_index", get.data_index);
router.get("/data_blog", get.data_blog);
router.get("/data_contact", get.data_contact);
router.get("/data_excel", get.data_excel);
router.get("/data_outlook", get.data_outlook);
router.get("/data_panier", get.data_panier);
router.get("/data_powerpoint", get.data_powerpoint);
router.get("/data_service", get.data_service);
router.get("/data_word", get.data_word);

module.exports = router;
