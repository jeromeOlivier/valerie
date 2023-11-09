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

