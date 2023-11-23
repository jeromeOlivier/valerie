/**
 * @class
 */
class Customer {
    /**
     * @description: Customer
     * @param {string} [given_name]
     * @param {string} [family_name]
     * @param {string} [email]
     * @param {string} [address]
     * @param {string} [city]
     * @param {string} [province]
     * @param {string} [postcode]
     * @param {string} [country]
     */
    constructor(given_name, family_name, email, address, city, province, postcode, country) {
        this.given_name = given_name;
        this.family_name = family_name;
        this.email = email;
        this.city = city;
        this.province = province;
        this.postcode = postcode;
        this.country = country;
    }
}

module.exports = { Customer }
