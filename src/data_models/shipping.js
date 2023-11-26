/**
 * @class
 */
class Shipping {
    /**
     * A findBook.
     * @typedef {Object} Shipping
     * @param {number} weight
     * @param {number} length
     * @param {number} width
     * @param {number} height
     */
    constructor(weight, length, width, height) {
        this.weight = weight;
        this.length = length;
        this.width = width;
        this.height = height;
    }
}

module.exports= { Shipping };