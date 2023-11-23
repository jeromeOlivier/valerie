/**
 * @class
 */
class Customer {
    /**
     * @description: Customer
     * @param {string} [email]
     * @param {string} [given_name]
     * @param {string} [family_name]
     * @param {string} [address]
     * @param {string} [city]
     * @param {string} [province]
     * @param {string} [postcode]
     * @param {string} [country]
     */
    constructor(email, given_name, family_name, address, city, province, postcode, country) {
        this.email = email;
        this.given_name = given_name;
        this.family_name = family_name;
        this.city = city;
        this.province = province;
        this.postcode = postcode;
        this.country = country;
    }
}

module.exports = { Customer }
