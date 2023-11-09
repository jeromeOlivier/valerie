// Description: This file contains the controllers for all GET requests.
const asyncHandler = require("express-async-handler");
const urlEndpointConfig = require("../data_models/url_endpoint_config");
const urlProductTypes = require("../data_models/url_product_types");
const db = require("../db_ops/db");
const { getPageData, getPageLayout, getBlogData, getBookPreviewImages } = require("../services/page_services");
const { getBook, getBookFormat, getWorkbooks } = require("../services/book_services");
const { getCartItems, getQuantityOfItem, getCartItemsFromCookie } = require("../services/cart_services");
const fs = require("fs");
const path = require("path");
const { INTERNAL_SERVER_ERROR, INVALID_QUERY } = require("../constants/messages");


// GET BOOKS (entry point for all books)
const book = asyncHandler(async(req, res) => getBook(req, res));
// GET BOOK FORMAT (entry point for all book formats)

const book_format = asyncHandler(async(req, res) => {
    // partial page load still requires the book data as its base
    const validTitle = urlProductTypes.has(req.params.title.toLowerCase());
    const validFormat = urlProductTypes.has(req.params.type.toLowerCase());
    if (!validTitle || !validFormat) { return res.status(500).send(INVALID_QUERY); }
    book.format = await getBookFormat(req.params.title, req.params.type);
    const cartItems = getCartItemsFromCookie(req.cookies);
    const quantity = getQuantityOfItem(cartItems, req.params.title, req.params.type);
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
    const images = await getBookPreviewImages(title);
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

// path: src/controllers/page_controllers.js
