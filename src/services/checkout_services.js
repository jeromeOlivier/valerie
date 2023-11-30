/**
 * checkout_services module
 * @module services/checkout_services
 */

module.exports = { processPurchaseTransaction, sanitizeShippingAddress, validatePDFForm };

const { Customer } = require("../data_models");
const fetch = require("node-fetch");

/**
 * Validates a paper form.
 *
 * @param {Customer} form - The address in form data to be validated.
 * @returns {object} - The validated object.
 */
async function sanitizeShippingAddress(form) {
    const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${ process.env.GOOGLE_MAP_API }`;
    const data = {
        "revision": 0,
        "regionCode": "CA",
        "postalCode": form.postcode,
        "administrativeArea": form.province,
        "locality": form.city,
        addressLines: [form.address],
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        // throw an error if API response is not ok
        throw new Error(
            `Google API responded with a ${ response.status } status.`
                `Error message: ${ response.statusText }`,
        );
    }
    return await response.json();
}

/**
 * Validates a PDF form based on specified rules.
 *
 * @param {Object} form - The PDF form data to be validated.
 * @returns {boolean} - Returns true if the form data complies with the rules, or false otherwise.
 */
function validatePDFForm(form) {
    // if form data complies to rules, return true or else false
}

/**
 * Processes a purchase transaction by sending the cart items and customer information to Stripe for payment.
 *
 * @param {Array} cartItems - The items in the cart.
 * @param {Object} customer - The customer information.
 * @return {Promise<void>} - A promise that resolves when the transaction is processed successfully.
 */
async function processPurchaseTransaction(cartItems, customer) {
    // send cartItems and customer info to Stripe for payment
}