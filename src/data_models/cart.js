/**
 * @class
 */
class Cart {
    /**
     * @param {CartItem[]} items
     * @param {number} [total]
     */
    constructor(items, total) {
        this.items = items;
        this.total = total;
    }
}

/**
 * @class
 */
class CartItem {
    /**
     * @param {string} title
     * @param {string} type
     * @param {number} quantity
     * @param {string} [price]
     * @param {string} [total]
     */
    constructor(title, type, quantity, price, total) {
        this.title = title;
        this.type = type;
        this.quantity = quantity;
        this.price = price;
        this.total = total;
    }
}

module.exports = { Cart, CartItem };

