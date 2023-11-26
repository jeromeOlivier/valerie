/**
 * router module
 * @module routes/index
 */

const router = require("express").Router();
const cartRouter = require("./endpoints/cart_routes");
const bookRouter = require("./endpoints/book_routes");
const pageRouter = require("./endpoints/static_routes");
const checkoutRouter = require("./endpoints/checkout_routes");
const postalRouter = require("./endpoints/postal_routes");

router.use("/", pageRouter);
router.use("/manuel", bookRouter);
router.use("/panier", cartRouter);
router.use('/caisse', checkoutRouter);
router.use("/postal", postalRouter);

module.exports = router;
