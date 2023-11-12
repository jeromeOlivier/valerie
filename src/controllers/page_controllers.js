// Description: This file contains the controllers for all GET requests.
const asyncHandler = require("express-async-handler");
const { getPageData, getPageLayout, getBlogData, getBookPreviewImages } = require("../services/page_services");
const { getBook, getBookFormat, isValidTitleAndType } = require("../services/book_services");
const { getQuantityOfItem, checkIfInCart } = require("../services/cart_services");
const { parseCartItemsFromCookie } = require("../services/cookie_services")

// GET BOOKS (entry point for all books)
const book = asyncHandler(async(req, res) => {
    const { book, path } = await getBook(req, res);
    const cartItems = parseCartItemsFromCookie(req.cookies);
    const isInCart = checkIfInCart(cartItems, book.title, 'pdf')
    res.render(path.full ? "layout" : "book", { main: "book", book, isInCart });
});

// GET BOOK FORMAT (entry point for all book formats)
const book_format = asyncHandler(async(req, res) => {
    // for template consistency, use book data structure as the base
    /**
     *
     * @type {Partial<Book>}
     */
    const book = { format: { } };
    book.format = await getBookFormat(req.params.title, req.params.type);
    const cartItems = parseCartItemsFromCookie(req.cookies);
    // if the book is already in the cart, disable the button
    const isInCart = checkIfInCart(cartItems, req.params.title, req.params.type);
    res.render("book_format", { book, isInCart });
});

// GET BLOG
const blog = asyncHandler(async(req, res) => {
    await res.render("layout", { main: "blog", contact: contact });
});
const data_blog = asyncHandler(async(req, res) => getBlogData(req, res));

// GET PREVIEWS
const preview = asyncHandler(async(req, res) => {
    const title = req.params.title;
    const images = await getBookPreviewImages(title);
    res.render("preview", { images });
});

// GET PAGES
const index = asyncHandler(async(req, res) => getPageLayout(req, res));
const data_index = asyncHandler(async(req, res) => getPageData(req, res));
const contact = asyncHandler(async(req, res) => getPageLayout(req, res));
const data_contact = asyncHandler(async(req, res) => getPageData(req, res));
const service = asyncHandler(async(req, res) => getPageLayout(req, res));
const data_service = asyncHandler(async(req, res) => getPageData(req, res));

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
