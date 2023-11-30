/**
 * module for checkout routes
 * @module routes/endpoints/checkout_routes
 */

const checkout = require("../../controllers/checkout_controllers");
const checkoutRouter = require("express").Router();

checkoutRouter.get('/', checkout.createCheckout);
checkoutRouter.get("/swap", checkout.createCheckout);
checkoutRouter.post("/papier", checkout.executePaperCheckout);
checkoutRouter.post("/pdf", checkout.updatePDFCheckout);

module.exports = checkoutRouter;
