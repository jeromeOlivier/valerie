/**
 * module for cart routes
 * @module routes/endpoints/cart_routes
 */

const cart = require("../../controllers/cart_controllers");
const cartRouter = require("express").Router();

cartRouter.get("/", cart.findCartItems);
cartRouter.get("/data", cart.findCartItems);
cartRouter.post("/add/:title/:type", cart.addCartItem);
cartRouter.delete("/delete/:title/:type", cart.deleteCartItem);

module.exports = cartRouter;