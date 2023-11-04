// Description: This file contains the handlers for all GET requests.
const asyncHandler = require("express-async-handler");
const validUrls = require("../data_models/validUrls");
const validFormats = require("../data_models/validFormats");
const db = require("../db_ops/db");
const { getPageData, getPageLayout, getBlogData, getImages } = require("../utils/getPages");
const { getBook, getBookFormat, getWorkbooks } = require("../utils/getBooks");
const { getCartItems } = require("../utils/getCartItems");
const fs = require("fs");
const path = require("path");

// GET BOOKS
const book = asyncHandler(async(req, res) => getBook(req, res, validUrls, validFormats));
const book_format = asyncHandler(async(req, res) => {
  const title = req.params.title;
  const format = req.params.type;
  const result = await getBookFormat(title, format, validFormats);
  res.render("book_format", { book_format: result });
});

// GET BLOG
const blog = asyncHandler(async(req, res) => {
  await res.render("layout", { main: "blog", contact: contact });
});
const data_blog = asyncHandler(async(req, res) => getBlogData(req, res, validUrls));

// GET PREVIEWS
const preview = asyncHandler(async(req, res) => {
  const title = req.params.title;
  const images = await getImages(title);
  res.render("preview", { images });
});

// GET PAGES
const index = asyncHandler(async(req, res) => getPageLayout(req, res, validUrls));
const data_index = asyncHandler(async(req, res) => getPageData(req, res, validUrls));
const contact = asyncHandler(async(req, res) => getPageLayout(req, res, validUrls));
const data_contact = asyncHandler(async(req, res) => getPageData(req, res, validUrls));
const service = asyncHandler(async(req, res) => getPageLayout(req, res, validUrls));
const data_service = asyncHandler(async(req, res) => getPageData(req, res, validUrls));

module.exports = {
  index,
  data_index,
  service,
  data_service,
  book,
  book_format,
  blog,
  data_blog,
  contact,
  data_contact,
  preview,
};

// path: src/handlers/get.js
