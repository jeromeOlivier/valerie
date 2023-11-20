/**
 * @class
 */
class Cart {
    /**
     * @param {CartItem[]} cartItems
     * @param {Total} [totals]
     * @param {boolean} [requirePostcode]
     */
    constructor(cartItems, totals, requirePostcode) {
        this.cartItems = cartItems;
        this.totals = totals;
        this.requirePostcode = requirePostcode;
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

module.exports = { Cart, CartItem, Total,  };

// path: src/data_models/cart.js

