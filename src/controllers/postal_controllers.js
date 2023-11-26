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

// /**
//  * Initiates a shopping session that returns a customer form
//  *
//  * @async
//  * @function initiate_shopping_session
//  * @param {Request} req - The request object.
//  * @param {Response} res - The response object.
//  * @return {void} - renders either the paper or pdf form view
//  */
// const initiateSession = asyncHandler(async(req, res) => {
//     try {
//         const cartItems = parseCartItemsFromCookie(req.cookies);
//         const postcode = getPostcodeFromRequestBodyOrCookie(req);
//         const existingSessionId = checkIfSessionIdAlreadyExists(req.cookies);
//         const uuid = existingSessionId ? existingSessionId : uuidv4();
//         updateCookie(res, uuid, "session_id");
//         /**
//          * Executes and waits for the promises to resolve/reject and then destructure it.
//          * @returns {Promise<[Customer, Cart]>}
//          */
//         const [customer, cart] = await Promise.all([
//             existingSessionId ? findCustomer(uuid) : createCustomer(uuid, postcode),
//             collectDataToBuildCart(cartItems, req),
//         ]);
//         const paperFormat = isAnyCartItemPaperFormat(cart.cartItems);
//         if (req.url === "/swap_caisse") {
//             res.render(paperFormat ? "paper_form" : "pdf_form", { customer, ...cart });
//         } else {
//             res.render("layout", { main: paperFormat ? "paper_form" : "pdf_form", customer, ...cart });
//         }
//     } catch (error) {
//         res.render("error_page", { message: error.message });
//     }
// });

module.exports = {
    getShippingEstimate,
    // initiateSession,
}
