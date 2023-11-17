const asyncHandler = require("express-async-handler");
const { getPageData, getPageLayout, getBlogData, getBookPreviewImages } = require("../services/page_services");
const { getBook, getBookFormat, isValidTitleAndType } = require("../services/book_services");
const { checkIfInCart } = require("../services/cart_services");
const { parseCartItemsFromCookie } = require("../services/cookie_services")

/**
 * Handles the logic for rendering the book page in response to a request.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {void}
 */
const book = asyncHandler(async(req, res) => {
    const { book, path } = await getBook(req, res);
    const cartItems = parseCartItemsFromCookie(req.cookies);
    const isInCart = checkIfInCart(cartItems, book.title, 'pdf')
    res.render(path.full ? "layout" : "book", { main: "book", book, isInCart });
});

/**
 * Handles the request to display the book format page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {undefined}
 */
const book_format = asyncHandler(async(req, res) => {
    /**
     * @type {Partial<Book>}
     */
    const book = { format: { } };
    book.format = await getBookFormat(req.params.title, req.params.type);
    const cartItems = parseCartItemsFromCookie(req.cookies);
    const isInCart = checkIfInCart(cartItems, req.params.title, req.params.type);
    res.render("book_format", { book, isInCart });
});

/**
 * Renders the "blog" page.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} Promise that resolves when rendering is complete.
 */
const blog = asyncHandler(async(req, res) => {
    await res.render("layout", { main: "blog", contact: contact });
});
const data_blog = asyncHandler(async(req, res) => getBlogData(req, res));

/**
 * Generate a preview of book images for rendering.
 *
 * @param {Function} asyncHandler - A middleware function that handles async operations.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const preview = asyncHandler(async(req, res) => {
    const title = req.params.title;
    const images = await getBookPreviewImages(title);
    res.render("preview", { images });
});

/**
 * Handles the request and response objects asynchronously and calls the getPageLayout function.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when getPageLayout function is completed.
 */
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
