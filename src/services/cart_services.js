/**
 * cart_services module
 * @module services/cart_services
 */

module.exports = {
    removeOneItemFromCart,
    confirmItemIsInCart,
    calculateTotalWeightOfItems,
    collectDataToBuildCart,
    isAnyCartItemPaperFormat,
};
// dependencies
const db = require("../db_ops/db");
const { CartItem, Total, Cart } = require("../data_models");
const { isValidTerm, transformToTitleCase } = require("./utility_services");
const {
    calculateShippingUsingPostcode,
    getPostcodeFromRequestBodyOrCookie,
    checkIfPostcodeIsRequired,
} = require("./postal_services");

/**
 * Gets all items in the cart based on values in the cookie items attribute
 * @param {Array.<CartItem>} cartItems
 * @returns {Promise<Array.<CartItem>>}
 */
async function getCartItems(cartItems) {
    if (cartItems.length === 0) { return []; }
    const validItems = validateCartItems(cartItems);
    const cartItemsWithPrices = await getPriceByNameAndType(validItems);
    return transformToTitleCase(cartItemsWithPrices);
}

/**
 * Retrieves the price for each item specified by name and type.
 * @param {Array.<CartItem>} cartItems - An array of cart items with name and type properties.
 * @return {Promise<Array.<CartItem>>} - A promise that resolves to an array of cart items with price property.
 * @throws {Error} - If fetching the price fails.
 */
async function getPriceByNameAndType(cartItems) {
    // prepare the WHERE clause for the SQL query
    let whereClause;
    if (cartItems.length === 0) {
        return [];
    } else if (cartItems.length === 1) {
        whereClause = `(b.title = "${ cartItems[0].title.trim() }" AND f.name = "${ cartItems[0].type.trim() }")`;
    } else {
        whereClause = cartItems.map(item =>
            `(b.title = "${ item.title.trim() }" AND f.name = "${ item.type.trim() }")`).join(" OR ");
    }
    // get the price for each item
    try {
        const [prices] = await db.query(`
            SELECT b.title, f.name AS type, bf.price
            FROM book_formats bf
                     JOIN books b ON b.id = bf.book_id
                     JOIN formats f ON f.id = bf.format
            WHERE ${ whereClause }
        `);
        // map the prices to the items
        return cartItems.map(item => {
            const matchingItem = prices.find(p => p.title.toLowerCase() === item.title.toLowerCase() && p.type.toLowerCase() === item.type.toLowerCase());
            return { ...item, price: matchingItem.price };
        });
    } catch (e) {
        throw new Error(`fetch price failed: ${ e }`);
    }
}

/**
 * Determines whether any cart item is in paper format.
 *
 * @param {Array.<CartItem>} cartItems - The array containing cart items.
 * @return {boolean} - True if there is any cart item in paper format, false otherwise.
 */
function isAnyCartItemPaperFormat(cartItems) {
    return cartItems.some(item => item.type.toLowerCase() === "papier");
}

/**
 * Validates an array of cart items.
 *
 * @param {Array.<CartItem>} cartItems - The array of cart items to be validated.
 * @return {Array.<CartItem>} - The array containing only valid cart items.
 * @throws {Error} - If an error occurs during validation.
 */
function validateCartItems(cartItems) {
    const validItems = [];
    if (!cartItems || cartItems.length === 0) return validItems;
    try {
        cartItems.forEach((item) => {
            const title = isValidTerm(item.title);
            const type = isValidTerm(item.type);
            if (title && type) { validItems.push(item); }
        });
        return validItems;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Removes a cart item that matches both parameters
 *
 * @param {Array.<CartItem>} oldCartItems
 * @param {string} title - The title of the item to be removed.
 * @param {string} type - The format type of the item to be removed.
 * @returns {Array.<CartItem>}
 */
function removeOneItemFromCart(oldCartItems, title, type) {
    const newCartItems = oldCartItems.filter(item => item.title !== title || item.type !== type);
    if (oldCartItems.length === newCartItems.length) {
        throw new Error("remove item not found");
    }
    return oldCartItems.filter(item => item.title !== title || item.type !== type);
}

/**
 * Calculates the total values of a shopping cart.
 *
 * @param {Array.<CartItem>} cartItems - An array of cart item objects.
 * @param {boolean} includesPaperFormat - Flag indicating whether the cart includes paper format items.
 * @param {string} postcode - The postal code used for calculating shipping (if applicable).
 * @returns {Promise<Total>} A promise that resolves to an object containing the cart totals.
 * @throws {Error} If unable to calculate the cart totals.
 */
async function getCartTotals(cartItems, includesPaperFormat, postcode) {
    const shipping = includesPaperFormat ? await calculateShippingUsingPostcode(cartItems, postcode) : "";
    const totals = {};
    totals.subtotal = cartItems.reduce((acc, cur) => {
        const total = parseFloat(cur.price);
        acc += total;
        return acc;
    }, 0).toFixed(2);
    totals.taxes = (((Number(totals.subtotal) * 100) * 0.14975) / 100).toFixed(2);
    totals.shipping = shipping;
    totals.total = (Number(totals.subtotal) + Number(totals.taxes) + Number(totals.shipping)).toFixed(2);
    return totals;
}

/**
 * Calculates the total cost of the cart items and returns the result.
 *
 * @param {Array.<CartItem>} cartItems - The list of items in the cart.
 * @param {string} postcode - The postcode for delivery.
 *
 * @return {Promise<Total>} - Totals is a promise for the total cost of the cart items.
 */
async function returnCartTotals(cartItems, postcode) {
    const includesPaperFormat = isAnyCartItemPaperFormat(cartItems);
    return await getCartTotals(cartItems, includesPaperFormat, postcode);
}

/**
 * Checks if an item with the specified title and type is present in the cart items.
 *
 * @param {Array} cartItems - An array of objects representing items in the cart.
 * @param {string} title - The title of the item to check.
 * @param {string} type - The type of the item to check.
 * @return {boolean} - Returns true if an item with the specified title and type is found in the cart,
 *                    otherwise returns false.
 */
function confirmItemIsInCart(cartItems, title, type) {
    return cartItems.some(item => item.title === title.toLowerCase() && item.type === type.toLowerCase());
}

/**
 * Calculates the total weight of items based on the given cookies.
 *
 * @param {Array.<CartItem>} cartItems - cart items.
 * @return {Promise<{weight: number, numberOfItems: number}>} - A promise that resolves to an object containing the
 *     total weight of the items and the number of items.
 */
async function calculateTotalWeightOfItems(cartItems) {
    // fetch the weight for all the items of type 'papier'
    const papierTitles = cartItems.filter(item => item.type.toLowerCase() === "papier").map(item => item.title);
    const [weights] = await db.query(`
        SELECT b.title, bf.weight, f.name AS type
        FROM book_formats bf
                 JOIN books b ON bf.book_id = b.id
                 JOIN formats f ON bf.format = f.id
        WHERE title IN (${ papierTitles.map(title => `"${ title }"`).join(", ") })
          AND f.name = 'papier'
    `);
    const totalWeight = weights.reduce((acc, cur) => acc + cur.weight, 0);
    // numberOfItems is used to select between envelope and box for shipping
    return { weight: totalWeight, numberOfItems: weights.length };
}

/**
 * Collects user postcode (if it already exists),  to build a shopping cart.
 *
 * @param {Array.<CartItem>} items - The request object containing cookies and the request body.
 * @param {Request} req - The request object containing cookies and the request body.
 * @return {Promise<Cart>} - A promise resolving to an
 *     object containing the shopping cart data.
 */
async function collectDataToBuildCart(items, req) {
    const cartItems = await getCartItems(items);
    const postcode = getPostcodeFromRequestBodyOrCookie(req);
    const requirePostcode = checkIfPostcodeIsRequired(cartItems, postcode);
    const totals = await returnCartTotals(cartItems, postcode);
    return new Cart(cartItems, totals, requirePostcode);
}
