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
const { getPostcodeFromRequestBodyOrCookie } = require("../services/postal_services");
const { findCustomer, createCustomer, updateCustomer, makeCustomerObject } = require("../services/customer_services");
const { collectDataToBuildCart, isAnyCartItemPaperFormat } = require("../services/cart_services");
const { processPurchaseTransaction, evaluateShippingAddressQuality, generateShippingAddress } = require("../services/checkout_services");
const { Customer, Cart, Conclusion } = require("../data_models");

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
            res.render(paperFormat ? "paper_form" : "pdf_form", { customer, ...cart, errors: new Set()});
        } else {
            res.render("layout", { main: paperFormat ? "paper_form" : "pdf_form", customer, ...cart, errors: new Set()});
        }
    } catch (error) {
        res.render("error_page", { error: error.message });
    }
});

const processPhysicalShippingCheckout = asyncHandler(async(req, res) => {
    const customer = makeCustomerObject(req.body);
    console.log('processPhysicalShippingCheckout customer', customer);
    // if emails don't match, send the form back
    if (customer.email !== req.body.confirm_email) {
        const cartItems = parseCartItemsFromCookie(req.cookies);
        const cart = await collectDataToBuildCart(cartItems, req);
        res.render("paper_form", { customer, ...cart, errors: new Set(['email']) });
        return;
    }
    try {
        const addressValidation = await evaluateShippingAddressQuality(customer.shippingAddress);
        const shippingAddress = generateShippingAddress(addressValidation.result);
        console.log('processPhysicalShippingCheckout shippingAddress', shippingAddress);
        if (addressValidation.conclusion === Conclusion.ACCEPT) {
            console.log("ACCEPT!");
            // save to database and open a stripe session
            return;
        }
        if (addressValidation.conclusion === Conclusion.CONFIRM) {
            console.log("CONFIRM!");
            // confirm between the original and updated versions
            // res.render("confirm_address", { shippingAddress });
            return;
        }
        if (addressValidation.conclusion === Conclusion.FIX) {
            console.log("FIX!");
            // send the form back
            return;
        }

        return addressValidation;
        // updateCustomer(validatedCustomer);
        // processTransaction();
        // if address rejected, render paper form view
    } catch (error) {
        res.render("error_page", { error: error.message });
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
    processPhysicalShippingCheckout,
    updatePDFCheckout,
};
