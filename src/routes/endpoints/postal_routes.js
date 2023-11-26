/**
 * module for postal routes
 * @module routes/endpoints/postal_routes
 */

const postal = require("../../controllers/postal_controllers");
const postalRouter = require("express").Router();

postalRouter.post("/estimate", postal.getShippingEstimate);

module.exports = postalRouter;