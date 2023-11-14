const asyncHandler = require("express-async-handler");
const {
    getCartItems,
    removeOneItemFromCart,
    getCartTotals,
    isAnyCartItemPaperFormat,
} = require("../services/cart_services");
const { validatePostcode } = require("../services/postcode_services");

const { CartItem } = require("../data_models/cart");
const { isValidTerm } = require("../services/utility_services");
const { saveCookie, addCartItemToCookie, parseCartItemsFromCookie } = require("../services/cookie_services");

// GET
const findAllItems = asyncHandler(async(req, res) => {
    const cartItemsFromCookies = parseCartItemsFromCookie(req.cookies);
    const cartItems = await getCartItems(cartItemsFromCookies);
    const cart = getCartTotals(cartItems);
    // generate flag to require postcode if paper format is present
    const requirePostcode = isAnyCartItemPaperFormat(cartItems);
    if (req.url === "/data_cart") {
        res.render("cart", { cartItems, cart, requirePostcode });
    } else {
        res.render("layout", { main: "cart", cartItems, cart, requirePostcode });
    }
});

// POST
const addItem = asyncHandler(async(req, res) => {
    addCartItemToCookie(req, res);
    const isInCart = true;
    res.render("book_format_add_button", { isInCart });
});

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
    const requirePostcode = isAnyCartItemPaperFormat(cartItems);
    res.render("cart", { cartItems, cart, requirePostcode });
});

const postcode = asyncHandler(async(req, res) => {
    const isValidPostcode = validatePostcode(req.body.postcode);
    if (!isValidPostcode) {
        throw new Error("Invalid postcode");
    }
    console.log("validated");
    res.send("postcode validated");
})

module.exports = {
    findAllItems,
    addItem,
    removeItem,
    postcode,
};