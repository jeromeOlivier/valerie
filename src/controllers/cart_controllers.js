/**
 * cart_controller module
 * @module controllers/cart_controllers
 */

// dependencies
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const {
    removeOneItemFromCart,
    collectDataToBuildCart,
    isAnyCartItemPaperFormat,
} = require("../services/cart_services");
const { getPostcodeFromRequestBodyOrCookie } = require("../services/postcode_services");
const { isValidTerm } = require("../services/utility_services");
const {
    updateCookie,
    addCartItemToCookie,
    parseCartItemsFromCookie,
    checkIfSessionIdAlreadyExists,
} = require("../services/cookie_services");
const { getCustomerFromDatabase, createCustomerInDatabase } = require("../services/user_services");

/**
 * Finds all items in the cart and renders the appropriate view based on the request URL.
 *
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */
const findAllCartItems = asyncHandler(async(req, res) => {
    try {
        const cartItemsFromCookies = parseCartItemsFromCookie(req.cookies);
        const collectedData = await collectDataToBuildCart(cartItemsFromCookies, req);

        if (req.url === "/data_cart") {
            res.render("cart", { ...collectedData });
        } else {
            res.render("layout", { main: "cart", ...collectedData });
        }
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
});

/**
 * Adds an item to the cart before updating the action button
 *
 * @async
 * @param {Object} req - The Request object.
 * @param {Object} res - The Response object.
 * @returns {void} - Renders the add_to_cart / view_cart toggle button
 */
const addItemToCart = asyncHandler(async(req, res) => {
    try {
        addCartItemToCookie(req, res);
        const isInCart = true;
        res.render("book_format_add_button", { isInCart });
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
});

/**
 * Controller to remove an item from the cart and then return the cart
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - A promise that resolves after removing the item from the cart and rendering the "cart" view.
 * @throws {Error} - If the parameters req.params.title or req.params.type are not valid.
 */
const removeItemFromCart = asyncHandler(async(req, res) => {
    if (!isValidTerm(req.params.title) || !isValidTerm(req.params.type)) {
        res.render('cart_error');
        return;
    }
    try {
        const cartItemsFromCookie = parseCartItemsFromCookie(req.cookies);
        const cartItemsAfterRemoval = removeOneItemFromCart(cartItemsFromCookie, req.params.title, req.params.type);
        updateCookie(res, cartItemsAfterRemoval, "items");
        const collectedData = await collectDataToBuildCart(cartItemsAfterRemoval, req);
        res.render("cart", { ...collectedData });
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
});

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

/**
 * Initiates a shopping session that returns a customer form
 *
 * @async
 * @function initiate_shopping_session
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {void} - renders either the paper or pdf form view
 */
const initiateShoppingSession = asyncHandler(async(req, res) => {
    try {
        const cartItems = parseCartItemsFromCookie(req.cookies);
        const postcode = getPostcodeFromRequestBodyOrCookie(req);
        const existingSessionId = checkIfSessionIdAlreadyExists(req.cookies);
        const uuid = existingSessionId ? existingSessionId : uuidv4();
        updateCookie(res, uuid, "session_id");
        /**
         * Represents a user.
         *
         * @type {Customer} - type Customer
         * @type {Cart} - object containing cartItems, totals, requirePostcode
         */
        const [user, cart] = await Promise.all([
            existingSessionId ? getCustomerFromDatabase(uuid) : createCustomerInDatabase(uuid, postcode),
            collectDataToBuildCart(cartItems, req),
        ]);
        console.log('user', user);
        console.log('cart', cart);
        const paperFormat = isAnyCartItemPaperFormat(cart.cartItems);
        res.render(paperFormat ? 'paper_form' : 'pdf_form', { user, ...cart });
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
});

const redirect = (req, res) => {
    res.status(200).json({ redirect: "/bounce" });
}

module.exports = {
    findAllCartItems,
    addItemToCart,
    removeItemFromCart,
    getShippingEstimate,
    initiateShoppingSession,
    redirect,
};
