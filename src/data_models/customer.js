/**
 * @class
 */
class Customer {
    /**
     * @description: Customer
     * @param {string} [given_name]
     * @param {string} [family_name]
     * @param {string} [email]
     * @param {ShippingAddress} shippingAddress
     */
    constructor(given_name, family_name, email, shippingAddress) {
        this.given_name = given_name;
        this.family_name = family_name;
        this.email = email;
        this.shippingAddress = shippingAddress;
    }
}

/**
 * @class
 */
class ShippingAddress {
    /**
     * @param {string} [address_01]
     * @param {string} [address_02]
     * @param {string} [city]
     * @param {string} [province]
     * @param {string} [postcode]
     * @param {string} [country]
     */
    constructor(address_01, address_02, city, province, postcode, country) {
        this.address_01 = address_01;
        this.address_02 = address_02;
        this.city = city;
        this.province = province;
        this.postcode = postcode;
        this.country = country;
    }
}

module.exports = { Customer, ShippingAddress };
