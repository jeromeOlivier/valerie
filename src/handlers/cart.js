const asyncHandler = require("express-async-handler");
const { getCartItems, getCartItemsFromCookie, handleCartUpdate } = require("../utils/getCookieCart");
const urlEndpointConfig = require("../data_models/urlEndpointConfig");
const { updateCookie } = require("../utils/cookieUtils");
const { CartItem } = require("../data_models/cart");

// GET
const find = asyncHandler(async(req, res) => {
    const cart = await getCartItems(req, res);
    res.render("cart", { cart: cart });
});

// POST
const add = asyncHandler(async(req, res) => {
    /**
     * @type {string}
     */
    const title = req.params.title;
    /**
     * @type {string}
     */
    const type = req.params.type;
    /**
     * @type {CartItem[]}
     */
    const cartItems = getCartItemsFromCookie(req.cookies);
    // add one to the quantity of the item if it already exists in the cart and return the new quantity
    const quantity = handleCartUpdate(cartItems, title, type, res);
    // rerender the button with the new quantity
    const book = {};
    book.format = {};
    book.format.title = title;
    book.format.type = type;
    console.log("book inside add:", book);
    console.log("quantity inside add:", quantity);
    res.render("book_format_add_button", { book, quantity });
});

module.exports = {
    find,
    add,
};