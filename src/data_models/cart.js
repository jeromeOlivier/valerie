/**
 * @class
 */
class Cart {
    /**
     * @param {string} title
     * @param {string} type
     * @param {number} quantity
     * @param {number} price
     * @param {number} total
     */
    constructor(title, type, quantity, price, total) {
        this.title = title;
        this.type = type;
        this.quantity = quantity;
        this.price = price;
        this.total = total;
    }
}

module.exports = { Cart };