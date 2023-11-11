const asyncHandler = require("express-async-handler");
const {
    getCartItems,
    parseCartItemsFromCookie,
    incrementCartItem,
    removeOneItemFromCart,
    getCartTotals,
} = require("../services/cart_services");

const { CartItem } = require("../data_models/cart");
const { isValidTerm } = require("../services/utility_services");
const { updateCookie } = require("../services/cookie_services");

// GET
const findAllItems = asyncHandler(async(req, res) => {
    const cartItemsFromCookies = parseCartItemsFromCookie(req.cookies);
    const cartItems = await getCartItems(cartItemsFromCookies);
    const cart = getCartTotals(cartItems);
    if (req.url === "/data_cart") {
        res.render("cart", { cartItems, cart });
    } else {
        res.render("layout", { main: "cart", cartItems, cart });
    }
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
    const cartItems = parseCartItemsFromCookie(req.cookies);
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
// const updateItem = asyncHandler(async(req, res) => {
//     const cartItems = updateCartItem(req, res);
//     console.log("req body:", req.body.type);
//     console.log("req url:", req.url);
// });

// DELETE
const removeItem = asyncHandler(async(req, res) => {
    if (!isValidTerm(req.params.title) || !isValidTerm(req.params.type)) {
        throw new Error("invalid parameters");
    }
    const cartItemsFromCookie = parseCartItemsFromCookie(req.cookies);
    const cartItemsAfterRemoval = removeOneItemFromCart(cartItemsFromCookie, req.params.title, req.params.type);
    // update the cookie
    updateCookie(res, cartItemsAfterRemoval);
    const cartItems = await getCartItems(cartItemsAfterRemoval)
    const cart = await getCartTotals(cartItems);
    res.render("cart", { cartItems, cart });
});

module.exports = {
    findAllItems,
    addItem,
    updateItem,
    removeItem,
};