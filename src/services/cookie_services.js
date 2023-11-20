module.exports = {
    updateCookie,
    addCartItemToCookie,
    parseCartItemsFromCookie,
    checkIfSessionIdAlreadyExists,
};
// dependencies
const { CartItem } = require("../data_models");

// constant to hold the max age of a cookie
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

/**
 * Returns the cart items array of the cookie.
 * @param cookies
 * @returns {Array<CartItem>}
 */
function parseCartItemsFromCookie(cookies) {
    return cookies ? JSON.parse(cookies.items || "[]") : [];
}

/**
 * This function updates the cookie with the provided data and key.
 *
 * @param {Response} res - The response object which allows to set cookies.
 * @param {array | string} data - data to be set in the cookie.
 * @param {string} key - key to be used to refer to the data being saved
 *
 * @returns {Object} - Returns the response object with the new, or updated key.
 */
function updateCookie(res, data, key) {
    return res.cookie(`${ key }`, JSON.stringify(data), {
        maxAge: ONE_DAY_IN_MS,
        sameSite: "Strict",
        secure: true,
    });
}

/**
 * Add new cart item to cookie, saves cookie, return an Array<cartItem>
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @return {Array<CartItem>}
 */
function addCartItemToCookie(req, res) {
    const newItem = new CartItem(req.params.title, req.params.type);
    const cookie = parseCartItemsFromCookie(req.cookies);
    cookie.push(newItem);
    updateCookie(res, cookie, "items");
    return cookie;
}

/**
 * Checks if a session ID already exists in the cookies.
 *
 * @param {Object} cookies - The cookies object containing session ID.
 *
 * @return { string | boolean } - The session ID if it exists, or false if it doesn't exist.
 */
function checkIfSessionIdAlreadyExists(cookies) {
    return cookies.session_id ? JSON.parse(cookies.session_id) : false;
}
