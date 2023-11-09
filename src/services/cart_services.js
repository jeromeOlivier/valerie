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
const { updateCookie } = require("./cookie_services");

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
    const itemsWithPrices = await getPriceByNameAndType(validItems);
    // uppercase the first letter of each title
    const formatTitles = itemsWithPrices.map(item => {
        const title = item.title.charAt(0).toUpperCase() + item.title.slice(1);
        return { ...item, title: title };
    });
    // add new total attribute to each item object with the price * quantity
    return formatTitles.map((item) => {
        return { ...item, total: (Number(item.price) * item.quantity).toFixed(2) };
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
 * Description: This function returns the number of items in the cart for the given title and format.
 * @param {Array<CartItem>} items
 * @param {string} title
 * @param {string} format
 * @returns {number}
 */
function getQuantityOfItem(items, title, format) {
    if (!items || items.length === 0) return 0;
    const item = items.find((i) => i.title === title.toLowerCase() && i.type === format);
    if (item) { return item.quantity; }
    return 0;
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
            const quantity = isValidQuantity(item.quantity);
            const type = isValidTerm(item.type);
            if (title && quantity && type) { validItems.push(item); }
        });
        return validItems;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Description: This function returns the cart items array of the cookie.
 * @param cookies
 * @returns {Array<CartItem>}
 */
function getCartItemsFromCookie(cookies) {
    return cookies ? JSON.parse(cookies.items || "[]") : [];
}

/**
 *
 * @param {Array<CartItem>} cartItems
 * @param {string} title
 * @param {string}  type
 * @param {response} res
 * @returns {number}
 */
function incrementCartItem(cartItems, title, type, res) {
    let quantity;
    if (cartItems.length > 0) {
        // if the item already exists in the cart, add one to the quantity
        const matchingItem = cartItems.find(item => item.title === title && item.type === type);
        if (matchingItem) {
            matchingItem.quantity += 1;
            quantity = matchingItem.quantity;
            // otherwise, add the item to the cart
        } else {
            const newCartItem = new CartItem(title, type, 1);
            cartItems.push(newCartItem);
            quantity = 1;
        }
    } else {
        const newCartItem = new CartItem(title, type, 1);
        cartItems.push(newCartItem);
        quantity = 1;
    }
    updateCookie(res, cartItems);
    return quantity;
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
        const total = parseFloat(cur.total);
        acc += total;
        return acc;
    }, 0).toFixed(2);
    cart.taxes = (((Number(cart.subtotal) * 100) * 0.14975) / 100).toFixed(2);
    cart.total = (Number(cart.subtotal) + Number(cart.taxes)).toFixed(2);
    return cart;
}

module.exports = {
    getCartItems,
    getQuantityOfItem,
    getCartItemsFromCookie,
    incrementCartItem,
    removeOneItemFromCart,
    getPriceByNameAndType,
    getCartTotals,
};