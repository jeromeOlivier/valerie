function getCartItems(req, res, validFormats) {
    // validate cookie data
    console.log('getCartItems')
    const cart = req.cookies.cart;
    console.log(cart);
    if (!cart) res.render("cart", { cart: [] });
    return cart;
}

module.exports = { getCartItems };