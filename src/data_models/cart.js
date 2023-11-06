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
     * @param {number} [price]
     */
    constructor(title, type, quantity, price) {
        this.title = title;
        this.type = type;
        this.quantity = quantity;
        this.price = price;
    }
}

module.exports = { Cart, CartItem };

