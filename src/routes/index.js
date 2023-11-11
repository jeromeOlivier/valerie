const express = require("express");
const router = express.Router();

const page = require("../controllers/page_controllers");
const cart = require("../controllers/cart_controllers");

const { Path } = require("../data_models/path");
const { Book, BookFormat, Workbook } = require("../data_models/book");
const { Cart, CartItem } = require("../data_models/cart");

// GET CONTENT WITH LAYOUT (whole page)
router.get("/", page.index);
router.get("/blog", page.blog);
router.get("/contact", page.contact);
router.get("/service", page.service);
router.get("/excel", page.book);
router.get("/outlook", page.book);
router.get("/powerpoint", page.book);
router.get("/word", page.book);

// GET CONTENT WITHOUT LAYOUT (partial page)
router.get("/data_index", page.data_index);
router.get("/data_blog", page.data_blog);
router.get("/data_contact", page.data_contact);
router.get("/data_service", page.data_service);
router.get("/data_excel", page.book);
router.get("/data_outlook", page.book);
router.get("/data_powerpoint", page.book);
router.get("/data_word", page.book);

// PARTIAL PAGE CONTENT
router.get("/format/:title/:type", page.book_format);
router.get("/preview/:title", page.preview);

// CART ENDPOINTS
router.get("/data_cart", cart.findAllItems)
router.get("/cart/", cart.findAllItems);
router.post("/cart/add/:title/:type", cart.addItem);
router.put("/cart/update/:title/:type", cart.updateItem);
router.delete("/cart/delete/:title/:type", cart.removeItem);


module.exports = router;
// path: src/routes/index.js
