

const page = require("../../controllers/page_controllers");
const bookRouter = require("express").Router();

/**
 * GET endpoint for the book page using excel data in a full page load
 */
bookRouter.get("/excel", page.book);
/**
 * GET endpoint for the book page using outlook data in a full page load
 */
bookRouter.get("/outlook", page.book);
/**
 * GET endpoint for the book page using powerpoint data in a full page load
 */
bookRouter.get("/powerpoint", page.book);
/**
 * GET endpoint for the book page using word data in a full page load
 */
bookRouter.get("/word", page.book);

/**
 * GET endpoint for the excel page in an htmx DOM swap
 */
bookRouter.get("/data_excel", page.book);
/**
 * GET endpoint for the outlook page in an htmx DOM swap
 */
bookRouter.get("/data_outlook", page.book);
/**
 * GET endpoint for the powerpoint page in an htmx DOM swap
 */
bookRouter.get("/data_powerpoint", page.book);
/**
 * GET endpoint for the word page in an htmx DOM swap
 */
bookRouter.get("/data_word", page.book);

module.exports = bookRouter;