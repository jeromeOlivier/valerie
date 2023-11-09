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

function addOneToQuantityOfItem(cookie, title, type) {
    const existingItemIndex = cookie.findIndex(item => item.title === title && item.type === type);
    if (existingItemIndex !== -1) {
        return cookie[existingItemIndex].quantity += 1;
    } else {
        return cookie.push({ title: title, type: type, quantity: 1 });
    }
}

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