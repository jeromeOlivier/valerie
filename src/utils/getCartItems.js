const db = require("../db_ops/db");
const validFormats = require("../data_models/validFormats");

async function getCartItems(req, res) {
    // if cart is empty, render empty cart page
    const cart = req.cookies.cart;
    if (!cart || cart.length === 0) {
        res.render("cart", { cart: [] });
    }
    // if cart is not empty, validate the titles and types against validFormats
    const cookie = JSON.parse(req.cookies.cart);
    const validItems = [];
    cookie.forEach((item) => {
        const title = validFormats.has(item.title);
        const quantity = item.quantity > 0;
        const type = validFormats.has(item.type);
        if (title && quantity && type) { validItems.push(item); }
    });

    // if all items are valid, get the price for each item from the database
    const items = await getPriceByNameAndType(validItems);
    // uppercase the first letter of each title
    const formatTitles = items.map(item => {
        const title = item.title.charAt(0).toUpperCase() + item.title.slice(1);
        return { ...item, title: title };
    });
    console.log('formatTitles:', formatTitles);
    // add new total attribute to each item object with the price * quantity
    const totalPrice = formatTitles.map((item) => {
        // const total = item.price * item.quantity;
        return { ...item, total: item.price * item.quantity };
    });
    console.log('totalPrice:', totalPrice);

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
    console.log('prices:', prices);
    console.log('items:', items);
    // map the prices to the items
    return items.map(item => {
        const price = prices.find(p => p.title.toLowerCase() === item.title && p.type === item.type);
        return { ...item, price: price ? price.price : 'erreur' };
    });
}

module.exports = { getCartItems };