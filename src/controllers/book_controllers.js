/**
 * book controllers module
 * @module controllers/book_controllers
 */

const asyncHandler = require("express-async-handler");
const { getBook, getBookFormat, getBookPreviewImages } = require("../services/book_services");
const { confirmItemIsInCart } = require("../services/cart_services");
const { parseCartItemsFromCookie } = require("../services/cookie_services");
const { isValidQuery, renderError500Page } = require("../services/utility_services");

/**
 * Handles the logic for rendering the book view.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
const findBook = asyncHandler(async(req, res) => {
    console.log('findBook req.url', req.url);
    if (!isValidQuery(req)) {
        renderError500Page(res);
        return;
    }
    try {
        const { book, full } = await getBook(req, res);
        const cartItems = parseCartItemsFromCookie(req.cookies);
        const isInCart = confirmItemIsInCart(cartItems, book.title, "pdf");

        res.render(full ? "layout" : "book", { main: "book", book, isInCart });
    } catch (error) {
        res.status(error.status).render("error_page", { message: error.message });
    }
});

/**
 * Handles the logic for rendering the book format view.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const findBookFormat = asyncHandler(async(req, res) => {
    if (!isValidQuery(req)) {
        renderError500Page(res);
        return;
    }
    try {
        /**
         * Book views always render a Book object, but only the BookFormat
         * attribute is needed here
         * @type {Partial<Book>}
         */
        const book = { format: {} };
        book.format = await getBookFormat(req.params.title, req.params.type);
        const cartItems = parseCartItemsFromCookie(req.cookies);
        const isInCart = confirmItemIsInCart(cartItems, req.params.title, req.params.type);
        res.render("book_format", { book, isInCart });
    } catch (error) {
        res.status(error.status).render("error_page", { message: error.message });
    }
});

/**
 * Handles the logic for the book preview slideshow
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const findBookPreview = asyncHandler(async(req, res) => {
    if (!isValidQuery(req)) {
        renderError500Page(res);
        return;
    }
    try {
        const title = req.params.title;
        const images = await getBookPreviewImages(title);
        res.render("preview", { images });
    } catch (error) {
        res.status(error.status).render("error_page", { message: error.message });
    }
});

module.exports = {
    findBook,
    findBookFormat,
    findBookPreview,
};
