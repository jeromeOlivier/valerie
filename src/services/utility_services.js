const {
  url_endpoint_config,
  url_product_types,
  Book,
  Workbook,
  BookFormat,
  Path,
  Cart,
  CartItem,
} = require("../data_models");

// VALIDATORS
/**
 * Description: This function returns the path if it is valid.
 * @param {Path} path
 * @returns {Path}
 */
function isValidPath(path) {
    return (path && path.title) ? path : null;
}

/**
 * Description: This function returns true if the given request is valid.
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
 * validate quantity
 * @param quantity
 * @returns {boolean}
 */
function isValidQuantity(quantity) {
    return quantity > 0 && quantity <= 3;
}

// SEARCH
/**
 * Description: This function returns the configuration for a given request.
 * @param req
 * @returns {Path | null}
 */
function fetchUrlEndpointConfiguration(req) {
    return url_endpoint_config.find((endPoint) => endPoint.path === req.url);
}

// TEXT MANIPULATION
// /**
//  * Description: This function returns strings with the first letter capitalized.
//  * @param {Array<CartItem>} cartItems
//  * @returns {Array<CartItem>}
//  */
// function capitalizeTitles(cartItems) {
//     return cartItems.map(item => {
//         const capitalizedTitle = item.title.charAt(0).toUpperCase() + item.title.slice(1);
//         return new CartItem(capitalizedTitle, item.type, item.quantity);
//     });
// }

module.exports = {
    isValidPath,
    isValidQuery,
    isValidTerm,
    isValidQuantity,
    fetchUrlEndpointConfiguration,
};