const asyncHandler = require("express-async-handler");
const validPages = require("../utils/validPages");

/**
 * Creates a handler function that wraps the given `handlerFunction`. This handler function can be used in an Express.js application.
 *
 * @param {Function} handlerFunction - The handler function to be wrapped.
 * @returns {Function} - The wrapped handler function.
 */
function createHandler(handlerFunction) {
  return asyncHandler(async (req, res) => handlerFunction(req, res));
}

/**
 * Retrieves the layout file to be rendered based on the requested page.
 *
 * @param {object} req - The request object that contains the URL information.
 * @param {object} res - The response object used to render the layout file.
 * @param {Array} validPages - An array of valid page objects with path and file properties.
 *
 * @return {void}
 */
function getLayout(req, res, validPages) {
  const request = req.url;
  const page = validPages.find((page) => page.path === request);
  if (page) {
    res.render("layout", { main: page.file });
  } else {
    res.render("layout", { main: "not_found" });
  }
}

/**
 * Retrieves the appropriate page file based on the requested URL.
 *
 * @param {Object} req - The request object that contains the URL information.
 * @param {Object} res - The response object to render the page.
 * @param {Array} validPages - An array of valid pages with their path and file information.
 *
 * @return {void} - Renders the corresponding page file or the "not_found" file if the page does not exist.
 */
function getData(req, res, validPages) {
  const request = req.url;
  const page = validPages.find((page) => page.path === request);
  if (page) {
    res.render(page.file);
  } else {
    res.render("not_found");
  }
}

/**
 * Initializes route handlers based on valid pages.
 *
 * @param {Array} validPages - An array of valid page objects.
 * @param {Function} getLayout - A function to get the layout for a page.
 * @param {Function} getData - A function to get the data for a page.
 * @returns {Object} - An object containing route handlers.
 */
const routeHandlers = validPages.reduce((handlers, page) => {
  handlers[page.path] = page.full
    ? createHandler(getLayout)
    : createHandler(getData);
  return handlers;
}, {});

module.exports = {
  routeHandlers,
};

// path: src/handlers/get.js
