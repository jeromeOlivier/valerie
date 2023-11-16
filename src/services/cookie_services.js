const {
  url_endpoint_config,
  url_product_types,
  Book,
  Workbook,
  BookFormat,
  Path,
  Cart,
  CartItem,
} = require("../data_models");

/**
 * Description: This function returns the cart items array of the cookie.
 * @param cookies
 * @returns {Array<CartItem>}
 */
function parseCartItemsFromCookie(cookies) {
    return cookies ? JSON.parse(cookies.items || "[]") : [];
}

/**
 * This function updates the "items" cookie with the provided cart items.
 *
 * @param {Object} res - The response object which allows to set cookies.
 * @param {array | string} data - data to be set in the cookie.
 * @param {string} key - key to be used to refer to the data being saved
 *
 * @returns {Object} - Returns the response object with the updated "items" cookie.
 */
function updateCookie(res, data, key) {
    return res.cookie(`${key}`, JSON.stringify(data), {
        maxAge: 1000 * 60 * 60 * 24 * 7,
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
    updateCookie(res, cookie, 'items');
    return cookie;
}

module.exports = {
    updateCookie,
    addCartItemToCookie,
    parseCartItemsFromCookie,
};