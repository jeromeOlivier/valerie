const express = require("express");
const router = express.Router();
const get = require("../handlers/get");
const cart = require("../handlers/cart");

// GET CONTENT WITH LAYOUT (whole page)
router.get("/", get.index);
router.get("/blog", get.blog);
router.get("/contact", get.contact);
router.get("/excel", get.book);
router.get("/outlook", get.book);
router.get("/powerpoint", get.book);
router.get("/service", get.service);
router.get("/word", get.book);

// GET CONTENT WITHOUT LAYOUT (partial page)
router.get("/data_index", get.data_index);
router.get("/data_blog", get.data_blog);
router.get("/data_contact", get.data_contact);
router.get("/data_excel", get.book);
router.get("/data_outlook", get.book);
router.get("/data_powerpoint", get.book);
router.get("/data_service", get.data_service);
router.get("/data_word", get.book);

// PARTIAL PAGE CONTENT
router.get("/format/:title/:type", get.book_format);
router.get("/preview/:title", get.preview);

// CART ENDPOINTS
router.get("/cart/find", cart.find);
router.post("/cart/add/:title/:type", cart.add);


module.exports = router;
// path: src/routes/index.js
