const db = require("../db_ops/db");
const urlProductTypes = require("../data_models/urlProductTypes");

async function processCookie(req, res) {
    const cart = parseCookieItems(req.cookies);
    // if cart is empty, render the cart page with an empty cart
    if (cart.items === []) {
        res.render("cart", cart.items);
    }
    // if cart is not empty, validate the items
    const validItems = validateCartItems(cart);
    // if all items are valid, get the price for each item from the database
    const itemsWithPrices = await getPriceByNameAndType(validItems);
    // uppercase the first letter of each title
    const formatTitles = itemsWithPrices.map(item => {
        const title = item.title.charAt(0).toUpperCase() + item.title.slice(1);
        return { ...item, title: title };
    });
    // add new total attribute to each item object with the price * quantity
    return formatTitles.map((item) => {
        return { ...item, total: item.price * item.quantity };
    });
}

async function getPriceByNameAndType(items) {
    // prepare the WHERE clause for the SQL query
    const whereClause = items.map(item =>
        `(b.title = "${ item.title }" AND f.name = "${ item.type }")`).join(" OR ");
    // get the price for each item
    const [prices] = await db.query(`
        SELECT b.title, f.name AS type, bf.price
        FROM book_formats bf
                 JOIN books b ON b.id = bf.book_id
                 JOIN formats f ON f.id = bf.format
        WHERE ${ whereClause }
    `);
    // map the prices to the items
    return items.map(item => {
        const price = prices.find(p => p.title.toLowerCase() === item.title && p.type === item.type);
        return { ...item, price: price ? price.price : "erreur" };
    });
}

/**
 * Description: This function returns the number of items in the cart for the given title and format.
 * @param {CartItem[]} items
 * @param {string} title
 * @param {string} format
 * @returns {number}
 */
function getQuantityForItem(items, title, format) {
    if (!items || items.length === 0) return 0;
    const item = items.find((i) => i.title === title.toLowerCase() && i.type === format);
    console.log("item inside queryCart:", item);
    if (item) { return item.quantity; }
    return 0;
}

function validateCartItems(cart) {
    const valid = {items: []};
    if (!cart || cart.items.length === 0) return valid;
    try {
        cart.items.forEach((item) => {
            console.log("item inside validateCartItems:", item);
            const title = urlProductTypes.has(item.title);
            const quantity = item.quantity > 0;
            const type = urlProductTypes.has(item.type);
            if (title && quantity && type) { valid.items.push(item); }
        });
        return valid;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Description: This function returns the cart items array of the cookie.
 * @param cookies
 * @returns {CartItem[]}
 */
function parseCookieItems(cookies) {
    return cookies ? JSON.parse(cookies.items || "[]") : [];
}

module.exports = { getCartItems: processCookie, getQuantityForItem, parseCookieItems, validateCartItems };