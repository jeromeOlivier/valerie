// Description: This file contains the handlers for all GET requests.
const asyncHandler = require("express-async-handler");
const urlEndpointConfig = require("../data_models/urlEndpointConfig");
const urlProductTypes = require("../data_models/urlProductTypes");
const db = require("../db_ops/db");
const { getPageData, getPageLayout, getBlogData, getImages } = require("../utils/getPages");
const { getBook, getBookFormat, getWorkbooks } = require("../utils/getBooks");
const { getCartItems, getQuantityForItem } = require("../utils/getCookieCart");
const fs = require("fs");
const path = require("path");
const { INTERNAL_SERVER_ERROR, INVALID_QUERY } = require("../constants/messages");


// GET BOOKS (entry point for all books)
const book = asyncHandler(async(req, res) => getBook(req, res));
// GET BOOK FORMAT (entry point for all book formats)

const book_format = asyncHandler(async(req, res) => {
    // partial page load still requires the book data as its base
    console.log("req.params.title:", req.params.title);
    console.log("req.params.format:", req.params.format);
    const validTitle = urlProductTypes.has(req.params.title.toLowerCase());
    const validFormat = urlProductTypes.has(req.params.format.toLowerCase());
    if (!validTitle || !validFormat) { return res.status(500).send(INVALID_QUERY); }
    book.format = await getBookFormat(req.params.title, req.params.format);
    console.log("book inside book_format:", book);
    const quantity = getQuantityForItem(req.cookies.items, req.params.title, req.params.format);
    res.render("book_format", { book, quantity });
});

// GET BLOG
const blog = asyncHandler(async(req, res) => {
    await res.render("layout", { main: "blog", contact: contact });
});
const data_blog = asyncHandler(async(req, res) => getBlogData(req, res, urlEndpointConfig));

// GET PREVIEWS
const preview = asyncHandler(async(req, res) => {
    const title = req.params.title;
    const images = await getImages(title);
    res.render("preview", { images });
});

// GET PAGES
const index = asyncHandler(async(req, res) => getPageLayout(req, res, urlEndpointConfig));
const data_index = asyncHandler(async(req, res) => getPageData(req, res, urlEndpointConfig));
const contact = asyncHandler(async(req, res) => getPageLayout(req, res, urlEndpointConfig));
const data_contact = asyncHandler(async(req, res) => getPageData(req, res, urlEndpointConfig));
const service = asyncHandler(async(req, res) => getPageLayout(req, res, urlEndpointConfig));
const data_service = asyncHandler(async(req, res) => getPageData(req, res, urlEndpointConfig));

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
