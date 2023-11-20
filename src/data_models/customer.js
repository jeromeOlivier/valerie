/**
 * @class
 */
class Customer {
    /**
     * @description: Customer
     * @param {string} [email]
     * @param {string} [name]
     * @param {string} [address]
     * @param {string} [city]
     * @param {string} [province]
     * @param {string} [postcode]
     * @param {string} [country]
     */
    constructor(email, name, address, city, province, postcode, country) {
        this.email = email;
        this.name = name;
        this.city = city;
        this.province = province;
        this.postcode = postcode;
        this.country = country;
    }
}

module.exports = { Customer }
