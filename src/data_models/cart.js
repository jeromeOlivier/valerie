/**
 * @class
 */
class Cart {
    /**
     * @param {CartItem[]} items
     * @param {number} [subtotal]
     * @param {number} [shipping]
     * @param {number} [taxes]
     * @param {number} [total]
     */
    constructor(items, subtotal, shipping, taxes, total) {
        this.items = items;
        this.subtotal = subtotal;
        this.shipping = shipping;
        this.taxes = taxes;
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
     * @param {string} [price]
     */
    constructor(title, type, price) {
        this.title = title;
        this.type = type;
        this.price = price;
    }
}

/**
 * @class
 */
class Total {
    /**
     * @param {string} subtotal
     * @param {string} taxes
     * @param {string} shipping
     * @param {string} total
     */
    constructor(subtotal, taxes, shipping, total) {
        this.subtotal = subtotal;
        this.taxes = taxes;
        this.shipping = shipping;
        this.total = total;
    }
}

module.exports = { Cart, CartItem, Total };

// path: src/data_models/cart.js

