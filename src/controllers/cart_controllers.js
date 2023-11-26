/**
 * cart controllers module
 * @module controllers/cart_controllers
 */

const asyncHandler = require("express-async-handler");
const { removeOneItemFromCart, collectDataToBuildCart } = require("../services/cart_services");
const { isValidTerm } = require("../services/utility_services");
const { updateCookie, addCartItemToCookie, parseCartItemsFromCookie } = require("../services/cookie_services");

/**
 * Finds all items in the cart and renders the appropriate view based on the request URL.
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */
const findCartItems = asyncHandler(async(req, res) => {
    try {
        const cartItemsFromCookies = parseCartItemsFromCookie(req.cookies);
        const collectedData = await collectDataToBuildCart(cartItemsFromCookies, req);

        if (req.url === "/data") {
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
 * @async
 * @param {Object} req - The Request object.
 * @param {Object} res - The Response object.
 * @returns {void} - Renders the add_to_cart / view_cart toggle button
 */
const addCartItem = asyncHandler(async(req, res) => {
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
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} - If the parameters req.params.title or req.params.type are not valid.
 */
const deleteCartItem = asyncHandler(async(req, res) => {
    if (!isValidTerm(req.params.title) || !isValidTerm(req.params.type)) {
        res.render("cart_error");
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

module.exports = {
    findCartItems,
    addCartItem,
    deleteCartItem,
};
