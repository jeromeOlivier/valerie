const asyncHandler = require("express-async-handler");
const { removeOneItemFromCart, collectDataToBuildCart, } = require("../services/cart_services");
const { getPostcodeFromRequestBodyOrCookie } = require("../services/postcode_services");
const { isValidTerm } = require("../services/utility_services");
const { updateCookie, addCartItemToCookie, parseCartItemsFromCookie } = require("../services/cookie_services");

/**
 * Finds all items in the cart and renders the appropriate view based on the request URL.
 *
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */
const find_all_items = asyncHandler(async(req, res) => {
    const cartItemsFromCookies = parseCartItemsFromCookie(req.cookies);
    const collectedData = await collectDataToBuildCart(cartItemsFromCookies, req);

    if (req.url === "/data_cart") {
        res.render("cart", { ...collectedData });
    } else {
        res.render("layout", { main: "cart", ...collectedData });
    }
});

/**
 * Adds an item to the cart before updating the action button
 *
 * @async
 * @param {Object} req - The Request object.
 * @param {Object} res - The Response object.
 * @returns {void}
 */
const add_item = asyncHandler(async(req, res) => {
    addCartItemToCookie(req, res);
    const isInCart = true;

    res.render("book_format_add_button", { isInCart });
});

/**
 * Controller to remove an item from the cart and then return the cart
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - A promise that resolves after removing the item from the cart and rendering the "cart" view.
 * @throws {Error} - If the parameters req.params.title or req.params.type are not valid.
 */
const remove_item = asyncHandler(async(req, res) => {
    if (!isValidTerm(req.params.title) || !isValidTerm(req.params.type)) {
        throw new Error("invalid parameters");
    }
    const cartItemsFromCookie = parseCartItemsFromCookie(req.cookies);
    const cartItemsAfterRemoval = removeOneItemFromCart(cartItemsFromCookie, req.params.title, req.params.type);
    updateCookie(res, cartItemsAfterRemoval, "items");
    const collectedData = await collectDataToBuildCart(cartItemsAfterRemoval, req);

    res.render("cart", { ...collectedData });
});

/**
 * Controller for receiving the postcode and returning cart with shipping estimate
 *
 * @async
 * @function get_shipping_estimate
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
const get_shipping_estimate = asyncHandler(async(req, res) => {
    const postcode = getPostcodeFromRequestBodyOrCookie(req);
    if (!postcode) { res.render("invalid_postcode"); }
    updateCookie(res, postcode, "postcode");
    const cartItems = parseCartItemsFromCookie(req.cookies);
    const collectedData = await collectDataToBuildCart(cartItems, req);

    res.render("cart", { ...collectedData });
});

module.exports = {
    find_all_items,
    add_item,
    remove_item,
    get_shipping_estimate,
};

// path: src/controllers/cart_controllers.js