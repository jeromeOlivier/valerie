const db = require("../db_ops/db");

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

const { isValidTerm, isValidQuantity } = require("./utility_services");
const item = require("../data_models/path");
const { type } = require("node:os");

/**
 * Gets all items in the cart based on values in the cookie items attribute
 * @param {Array<CartItem>} cartItems
 * @returns {Promise<Array<CartItem>>}
 */
async function getCartItems(cartItems) {
    // if cart is empty, render the cart page with an empty cart
    if (cartItems.length === 0) {
        return [];
    }
    // if cart is not empty, validate the items
    const validItems = validateCartItems(cartItems);
    // if all items are valid, get the price for each item from the database
    const cartItemsWithPrices = await getPriceByNameAndType(validItems);
    // uppercase the first letter of each title
    const cartItemsWithFormattedTitles = cartItemsWithPrices.map(item => {
        const title = item.title.charAt(0).toUpperCase() + item.title.slice(1);
        return { ...item, title: title };
    });
    console.log('cartItemsWithFormattedTitles', cartItemsWithFormattedTitles);
    // add new total attribute to each item object with the price * quantity
    return cartItemsWithFormattedTitles.map((item) => {
        return { ...item };
    });
}

/**
 *
 * @param {Array<CartItem>} items - The array of items to get prices for.
 * @returns {Promise<Array<CartItem>> || []} - A promise that resolves to an array of items with their corresponding
 * prices.
 */
async function getPriceByNameAndType(items) {
    // prepare the WHERE clause for the SQL query
    let whereClause;
    if (items.length === 0) {
        return [];
    } else if (items.length === 1) {
        whereClause = `(b.title = "${ items[0].title.trim() }" AND f.name = "${ items[0].type.trim() }")`;
    } else {
        whereClause = items.map(item =>
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
        return items.map(item => {
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
 * @param {Array<CartItem>} cartItems - The array containing cart items.
 * @return {boolean} - True if there is any cart item in paper format, false otherwise.
 */
function isAnyCartItemPaperFormat(cartItems) {
    return cartItems.some(item => item.type.toLowerCase() === "papier");
}

/**
 *
 * @param {Array<CartItem>}cartItems
 * @returns {Array<CartItem>}
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
 * @param {Array<CartItem>} oldCartItems
 * @param {string} title - The title of the item to be removed.
 * @param {string} type - The format type of the item to be removed.
 * @returns {Array<CartItem>}
 */
function removeOneItemFromCart(oldCartItems, title, type) {
    const newCartItems = oldCartItems.filter(item => item.title !== title || item.type !== type);
    if (oldCartItems.length === newCartItems.length) {
        throw new Error("remove item not found");
    }
    return oldCartItems.filter(item => item.title !== title || item.type !== type);
}

/**
 * Calculates the totals excluding shipping.
 *
 * @param {Array<CartItem>} cartItems - An array containing the items in the shopping cart.
 * @returns {Cart}
 */
function getCartTotals(cartItems) {
    const cart = {};
    cart.subtotal = cartItems.reduce((acc, cur) => {
        const total = parseFloat(cur.price);
        acc += total;
        return acc;
    }, 0).toFixed(2);
    cart.taxes = (((Number(cart.subtotal) * 100) * 0.14975) / 100).toFixed(2);
    cart.total = (Number(cart.subtotal) + Number(cart.taxes)).toFixed(2);
    return cart;
}

/**
 *
 * @param {Array<CartItem>} cartItems
 * @param {string} title
 * @param {string} type
 * @returns {boolean}
 */
function checkIfInCart(cartItems, title, type) {
    console.log('cartItems', cartItems);
    console.log('title', title);
    console.log('type', type);
    return cartItems.some(item => item.title === title.toLowerCase() && item.type === type.toLowerCase());
}

module.exports = {
    getCartItems,
    isAnyCartItemPaperFormat,
    removeOneItemFromCart,
    getCartTotals,
    checkIfInCart,
};