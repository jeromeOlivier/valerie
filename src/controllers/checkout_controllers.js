/**
 * checkout controllers module
 * @module controllers/checkout_controllers
 */

const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const {
    parseCartItemsFromCookie,
    checkIfSessionIdAlreadyExists,
    updateCookie,
} = require("../services/cookie_services");
const { getPostcodeFromRequestBodyOrCookie, sanitizeShippingAddress } = require("../services/postal_services");
const { findCustomer, createCustomer, updateCustomer } = require("../services/customer_services");
const { collectDataToBuildCart, isAnyCartItemPaperFormat } = require("../services/cart_services");
const { processPurchaseTransaction } = require("../services/checkout_services");

/**
 * create a checkout session that returns a form view for the customer to fill out
 *
 * @async
 * @function createCheckout
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {void} - renders either the paper or pdf form view
 */
const createCheckout = asyncHandler(async(req, res) => {
    try {
        const cartItems = parseCartItemsFromCookie(req.cookies);
        const postcode = getPostcodeFromRequestBodyOrCookie(req);
        const existingSessionId = checkIfSessionIdAlreadyExists(req.cookies);
        const uuid = existingSessionId ? existingSessionId : uuidv4();
        updateCookie(res, uuid, "session_id");
        /**
         * Executes and waits for the promises to resolve/reject and return destructured data.
         * @returns {Promise<[Customer, Cart]>}
         */
        const [customer, cart] = await Promise.all([
            existingSessionId ? findCustomer(uuid) : createCustomer(uuid, postcode),
            collectDataToBuildCart(cartItems, req),
        ]);
        const paperFormat = isAnyCartItemPaperFormat(cart.cartItems);
        if (req.url === "/swap") {
            res.render(paperFormat ? "paper_form" : "pdf_form", { customer, ...cart });
        } else {
            res.render("layout", { main: paperFormat ? "paper_form" : "pdf_form", customer, ...cart });
        }
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
});

const updatePaperCheckout = asyncHandler(async(req, res) => {
    try {
        // validatePaperForm();
        // sanitizeShippingAddress();
        // if no errors found...
        // updateCustomer();
        // processPurchaseTransaction();
        // if address rejected, render paper form view
    } catch (error) {
        res.render("error_page", { message: error.message });
    }

});

const updatePDFCheckout = asyncHandler(async(req, res) => {
    try {
        // updateCustomer();
        // processPurchaseTransaction();
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
});

module.exports = {
    createCheckout,
    updatePaperCheckout,
    updatePDFCheckout,
};
