const asyncHandler = require("express-async-handler");
const { getCartItems } = require("../utils/getCookieCart");
const urlEndpointConfig = require("../data_models/urlEndpointConfig");
const { updateCookie } = require("../utils/cookieUtils");

// GET
const find = asyncHandler(async(req, res) => {
  const cart = await getCartItems(req, res);
  res.render("cart", { cart: cart });
});

// POST
const add = asyncHandler(async(req, res) => {
  const title = req.params.title;
  const type = req.params.type;
  const cookie = req.cookies ? JSON.parse(req.cookies.cart || '[]') : [];
  console.log('cookie inside add:', cookie);
  let quantity;
  if (cookie.length > 0) {
    const existingItemIndex = cookie.findIndex(item => item.title === title && item.type === type);
    if (existingItemIndex !== -1) {
      cookie[existingItemIndex].quantity += 1;
      quantity = cookie[existingItemIndex].quantity;
    } else {
      cookie.push({ title: title, type: type, quantity: 1 });
    }
  } else {
    cookie.push({ title: title, type: type, quantity: 1 });
  }
  res.cookie("items", JSON.stringify(cookie), {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });
  const data = { title: title, type: type, quantity: quantity}
  res.render("book_format_add_button", { book_format: data });
});

module.exports = {
  find,
  add,
};