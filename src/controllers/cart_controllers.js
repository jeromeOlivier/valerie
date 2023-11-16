const asyncHandler = require("express-async-handler");
const {
    getCartItems,
    removeOneItemFromCart,
    getCartTotals,
    isAnyCartItemPaperFormat,
    calculateTotalWeightOfItems,
} = require("../services/cart_services");
const {
    formatPostcode,
    calculateShippingUsingPostcode } = require("../services/postcode_services");

const { isValidTerm } = require("../services/utility_services");
const { updateCookie, addCartItemToCookie, parseCartItemsFromCookie } = require("../services/cookie_services");

// GET
const find_all_items = asyncHandler(async(req, res) => {
    const cartItemsFromCookies = parseCartItemsFromCookie(req.cookies);
    const cartItems = await getCartItems(cartItemsFromCookies);
    // generate flag if paper format is present
    let requirePostcode = isAnyCartItemPaperFormat(cartItems);
    // if postcode already present, calculate shipping
    const isValidPostcode = formatPostcode(req);
    let totals = {};
    console.log('isValidPostcode', isValidPostcode);
    if (isValidPostcode) {
        const shipping = await calculateShippingUsingPostcode(req, isValidPostcode);
        totals = getCartTotals(cartItems, shipping)
        requirePostcode = false;
    }
    if (isValidPostcode === undefined) {
        requirePostcode = true;
    }
    if (req.url === "/data_cart") {
        res.render("cart", { cartItems, totals, requirePostcode });
    } else {
        res.render("layout", { main: "cart", cartItems, totals, requirePostcode });
    }
});

// POST
const add_item = asyncHandler(async(req, res) => {
    addCartItemToCookie(req, res);
    const isInCart = true;
    res.render("book_format_add_button", { isInCart });
});

// DELETE
const remove_item = asyncHandler(async(req, res) => {
    if (!isValidTerm(req.params.title) || !isValidTerm(req.params.type)) {
        throw new Error("invalid parameters");
    }
    const cartItemsFromCookie = parseCartItemsFromCookie(req.cookies);
    const cartItemsAfterRemoval = removeOneItemFromCart(cartItemsFromCookie, req.params.title, req.params.type);
    // update the cookie
    updateCookie(res, cartItemsAfterRemoval, "items");
    const cartItems = await getCartItems(cartItemsAfterRemoval);
    const cart = await getCartTotals(cartItems);
    const requirePostcode = isAnyCartItemPaperFormat(cartItems);
    res.render("cart", { cartItems, cart, requirePostcode });
});

const get_shipping_estimate = asyncHandler(async(req, res) => {
    const isValidPostcode = formatPostcode(req);
    if (!isValidPostcode) {
        res.render("invalid_postcode");
    }
    updateCookie(res, isValidPostcode, "postcode");
    // calculate weight and number of items to ship
    const totalShipping = await calculateShippingUsingPostcode(req, isValidPostcode);
    // collect info to rebuild the cart
    const cartItemsFromCookies = parseCartItemsFromCookie(req.cookies);
    const cartItems = await getCartItems(cartItemsFromCookies);
    const totals = getCartTotals(cartItems, totalShipping);
    const requirePostcode = false;
    res.render("cart", { cartItems, totals, requirePostcode });
});

module.exports = {
    find_all_items,
    add_item,
    remove_item,
    get_shipping_estimate,
};