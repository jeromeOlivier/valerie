const page = require("../../controllers/page_controllers");
const pageRouter = require("express").Router();

// GET CONTENT WITH LAYOUT (whole page)
/**
 * GET endpoint for the index page in a full page load
 */
pageRouter.get("", page.index);
/**
 * GET endpoint for the blog page in a full page load
 */
pageRouter.get("/blog", page.blog);
/**
 * GET endpoint for the contact page in a full page load
 */
pageRouter.get("/contact", page.contact);
/**
 * GET endpoint for the blog service page in a full page load
 */
pageRouter.get("/service", page.service);

// GET CONTENT WITHOUT LAYOUT (partial page)
/**
 * GET endpoint for the index page in an htmx DOM swap
 */
pageRouter.get("/data_index", page.data_index);
/**
 * GET endpoint for the blog page in an htmx DOM swap
 */
pageRouter.get("/data_blog", page.data_blog);
/**
 * GET endpoint for the contact page in an htmx DOM swap
 */
pageRouter.get("/data_contact", page.data_contact);
/**
 * GET endpoint for the service page in an htmx DOM swap
 */
pageRouter.get("/data_service", page.data_service);

// ELEMENTS
/**
 * GET endpoint for the book type element in an htmx DOM swap
 */
pageRouter.get("/format/:title/:type", page.book_format);
/**
 * GET endpoint for the book preview element in an htmx DOM swap
 */
pageRouter.get("/preview/:title", page.preview);

module.exports = pageRouter;