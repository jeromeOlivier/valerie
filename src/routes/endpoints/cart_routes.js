/**
 * @module cart_routes
 * @typedef {object} Router - Express router
 */
const cartRouter = require("express").Router();
const cart = require("../../controllers/cart_controllers");


/**
 * GET endpoint for the cart page in a full page load
 */
cartRouter.get("/", cart.findAllCartItems);
/**
 * GET endpoint for the cart page in a htmx DOM swap
 */
cartRouter.get("/data", cart.findAllCartItems);

/**
 * GET endpoint to initiate a checkout process
 */
cartRouter.get('/caisse', cart.initiateShoppingSession);
/**
 * GET endpoint for the cart page in either a full page load or a htmx DOM swap
 */
cartRouter.get("/data_caisse", cart.initiateShoppingSession);

/**
 * POST endpoint to add an item to the cart
 */
cartRouter.post("/add/:title/:type", cart.addItemToCart);
/**
 * POST endpoint to send postcode and receive a shipping estimate in return
 */
cartRouter.post("/shipping_estimate", cart.getShippingEstimate);
/**
 * POST endpoint to process payment with stripe
 */
cartRouter.post("/payment", cart.confirmCustomerAddress);

/**
 * DELETE endpoint to remove an item from the cart
 */
cartRouter.delete("/delete/:title/:type", cart.removeItemFromCart);

module.exports = cartRouter;