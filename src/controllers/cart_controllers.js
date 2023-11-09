const asyncHandler = require("express-async-handler");
const {
    getCartItems,
    getCartItemsFromCookie,
    incrementCartItem,
    removeOneItemFromCart,
    getCartSubTotal,
} = require("../services/cart_services");

const { CartItem } = require("../data_models/cart");
const { isValidTerm } = require("../services/utility_services");
const { updateCookie } = require("../services/cookie_services");

// GET
const findAllItems = asyncHandler(async(req, res) => {
    const cartItemsFromCookies = getCartItemsFromCookie(req.cookies);
    const cartItems = await getCartItems(cartItemsFromCookies);
    console.log(cartItems);
    const cartTotal = getCartSubTotal(cartItems);
    console.log(cartTotal);
    res.render("cart", { cartItems, cartTotal });
});

// POST
const addItem = asyncHandler(async(req, res) => {
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
    const quantity = incrementCartItem(cartItems, title, type, res);
    // rerender the button with the new quantity
    const book = {};
    book.format = {};
    book.format.title = title;
    book.format.type = type;
    res.render("book_format_add_button", { book, quantity });
});

// PUT
const updateItem = asyncHandler(async(req, res) => {
    console.log("req body:", req.body);
    console.log("req url:", req.url);
});

// DELETE
const removeItem = asyncHandler(async(req, res) => {
    if (!isValidTerm(req.params.title) || !isValidTerm(req.params.type)) {
        throw new Error("invalid parameters");
    }
    const cartItemsFromCookie = getCartItemsFromCookie(req.cookies);
    const cartItemsAfterRemoval = removeOneItemFromCart(cartItemsFromCookie, req.params.title, req.params.type);
    // update the cookie
    updateCookie(res, cartItemsAfterRemoval);
    const cartItems = await getCartItems(cartItemsAfterRemoval)
    const cartTotal = await getCartSubTotal(cartItems);
    console.log(cartTotal);
    res.render("cart", { cartItems, cartTotal });

});

module.exports = {
    findAllItems,
    addItem,
    updateItem,
    removeItem,
};