/**
 * @module router
 * @typedef {object} Router - Express router
 */
const router = require("express").Router();
const cartRouter = require("./endpoints/cart_routes");
const bookRouter = require("./endpoints/book_routes");
const pageRouter = require("./endpoints/page_routes");

router.use("/panier", cartRouter);
router.use("/manuel", bookRouter);
router.use("/", pageRouter);

module.exports = router;
