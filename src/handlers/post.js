const asyncHandler = require("express-async-handler");

const addToCart = asyncHandler(async(req, res) => {
  const title = req.params.title;
  const type = req.params.type;
  const cookie = req.cookies ? JSON.parse(req.cookies.cart || '[]') : [];
  if (cookie.length > 0) {
    const existingItemIndex = cookie.findIndex(item => item.title === title && item.type === type);
    if (existingItemIndex !== -1) {
      cookie[existingItemIndex].quantity += 1;
    } else {
      cookie.push({ title: title, type: type, quantity: 1 });
    }
  } else {
    cookie.push({ title: title, type: type, quantity: 1 });
  }
  console.log(cookie);
  res.cookie("cart", JSON.stringify(cookie), {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });
  res.status(200).send(`title: ${ title }, type: ${ type } added to basket`);
});

module.exports = {
  addToCart,
};