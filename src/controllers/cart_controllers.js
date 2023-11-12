const asyncHandler = require("express-async-handler");
const {
    getCartItems,
    removeOneItemFromCart,
    getCartTotals,
} = require("../services/cart_services");

const { CartItem } = require("../data_models/cart");
const { isValidTerm } = require("../services/utility_services");
const { saveCookie, addCartItemToCookie, parseCartItemsFromCookie } = require("../services/cookie_services");

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
    addCartItemToCookie(req, res);
    const isInCart = true;
    res.render("book_format_add_button", { isInCart });
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
    saveCookie(res, cartItemsAfterRemoval);
    const cartItems = await getCartItems(cartItemsAfterRemoval)
    const cart = await getCartTotals(cartItems);
    res.render("cart", { cartItems, cart });
});

module.exports = {
    findAllItems,
    addItem,
    removeItem,
};