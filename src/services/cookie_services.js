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
 * This function adds one to the quantity of a specific item type and title in a cart.
 *
 * @param {Array} cookie - An array representing the current state of the cart cookie. It contains objects with item details (title, type, quantity).
 * @param {string} title - The title of the item whose quantity needs to be incremented.
 * @param {string} type - The type of the item whose quantity needs to be incremented.
 *
 * @returns {number | undefined} - Returns the updated quantity of the item if existing, otherwise a modified cookie array with new item added.
 */
function addOneToQuantityOfItem(cookie, title, type) {
    const existingItemIndex = cookie.findIndex(item => item.title === title && item.type === type);
    if (existingItemIndex !== -1) {
        return cookie[existingItemIndex].quantity += 1;
    } else {
        return cookie.push({ title: title, type: type, quantity: 1 });
    }
}

/**
 * This function updates the "items" cookie with the provided cart items.
 *
 * @param {Object} res - The response object which allows to set cookies.
 * @param {Array} cartItems - An array of cart items to be set in the "items" cookie.
 *
 * @returns {Object} - Returns the response object with the updated "items" cookie.
 */
function updateCookie(res, cartItems) {
    return res.cookie("items", JSON.stringify(cartItems), {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "Strict",
        secure: true,
    });
}

module.exports = {
    addOneToQuantityOfItem, updateCookie,
};