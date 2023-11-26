/**
 * module for book routes
 * @module routes/endpoints/book_routes
 */

const book = require("../../controllers/book_controllers");
const bookRouter = require("express").Router();

// full page requests
bookRouter.get("/excel", book.findBook);
bookRouter.get("/outlook", book.findBook);
bookRouter.get("/powerpoint", book.findBook);
bookRouter.get("/word", book.findBook);
// htmx swap requests
bookRouter.get("/swap_excel", book.findBook);
bookRouter.get("/swap_outlook", book.findBook);
bookRouter.get("/swap_powerpoint", book.findBook);
bookRouter.get("/swap_word", book.findBook);
// htmx swaps to display book formats
bookRouter.get("/format/:title/:type", book.findBookFormat)

module.exports = bookRouter;
