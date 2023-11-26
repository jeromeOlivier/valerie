/**
 * utility services module
 * @module services/utility_services
 */

module.exports = {
    isValidPath: isValidConfiguration,
    isValidQuery,
    isValidTerm,
    findUrlEndpointConfiguration,
    transformToTitleCase,
    isValidTitleAndType,
    validatePaperForm,
    validatePDFForm,
    renderError500Page,
};

const { url_endpoint_config, url_product_types, Configuration, CartItem } = require("../data_models");

/**
 * This function returns the configuration if it is valid.
 * @param {Configuration} configuration
 * @returns {Configuration}
 */
function isValidConfiguration(configuration) {
    return (configuration && configuration.title) ? configuration : null;
}

/**
 * This function returns true if the given request is valid.
 * @param req
 * @returns {boolean}
 */
function isValidQuery(req) {
    return req && typeof req.url === "string";
}

/**
 * validate term
 * @param {string} term
 * @returns {boolean}
 */
function isValidTerm(term) {
    return url_product_types.has(term);
}

/**
 * This function returns the configuration for the requested url.
 * @param {Request} req
 * @returns {Configuration | null}
 */
function findUrlEndpointConfiguration(req) {
    return url_endpoint_config.find((endPoint) => endPoint.path === req.url) || null;
}

/**
 * Transforms the titles of cart items to title case.
 *
 * @param {Array} cartItems - The array of cart items.
 * @return {Array} - The array of cart items with titles transformed to title case.
 */
function transformToTitleCase(cartItems) {
    return cartItems.map(item => {
        const capitalizedTitle = item.title.charAt(0).toUpperCase() + item.title.slice(1);
        return new CartItem(capitalizedTitle, item.type, item.price);
    });
}

/**
 * Checks if a given title and format is valid.
 *
 * @param {string} title - The title of the product.
 * @param {string} format - The format of the product.
 *
 * @return {boolean} Returns true if both the title and format are valid, false otherwise.
 */
function isValidTitleAndType(title, format) {
    const validTitle = url_product_types.has(title.toLowerCase());
    const validFormat = url_product_types.has(format.toLowerCase());
    return validTitle && validFormat;
}

function validatePaperForm(form) {}

function validatePDFForm(form) {}

/**
 * Renders a 500 error page.
 * @param {object} res - The response object.
 * @return {void}
 */
function renderError500Page(res) {
    res.status(500).render("error_page", { message: `${ INVALID_QUERY }` });
}
