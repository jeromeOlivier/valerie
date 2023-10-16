const asyncHandler = require("express-async-handler");

// get content with layout
const accueil = asyncHandler(async (req, res) =>
  res.render("layout", { content: "index" }),
);

// get content without layout
const content_accueil = asyncHandler(async (req, res) => res.render("index"));

module.exports = {
  content_accueil,
  accueil,
};
