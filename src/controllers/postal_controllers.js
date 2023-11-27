/**
 * checkout controllers module
 * @module controllers/checkout_controllers
 */

const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { parseCartItemsFromCookie, checkIfSessionIdAlreadyExists, updateCookie } = require("../services/cookie_services");
const { getPostcodeFromRequestBodyOrCookie } = require("../services/postal_services");
const { findCustomer, createCustomer  } = require("../services/customer_services");
const { collectDataToBuildCart, isAnyCartItemPaperFormat } = require("../services/cart_services");

/**
 * Controller for receiving the postcode and returning cart with shipping estimate
 *
 * @async
 * @function getShippingEstimate
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
const getShippingEstimate = asyncHandler(async(req, res) => {
    try {
        const postcode = getPostcodeFromRequestBodyOrCookie(req);
        if (!postcode) {
            res.render("invalid_postcode");
            return;
        }
        updateCookie(res, postcode, "postcode");
        const cartItems = parseCartItemsFromCookie(req.cookies);
        const collectedData = await collectDataToBuildCart(cartItems, req);

        res.render("cart", { ...collectedData });
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
});

module.exports = { getShippingEstimate }
