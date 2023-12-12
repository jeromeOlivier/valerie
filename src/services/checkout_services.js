/**
 * checkout_services module
 * @module services/checkout_services
 */

module.exports = { processPurchaseTransaction, evaluateShippingAddressQuality, generateShippingAddress };

const { GoogleAddressValidation, Conclusion, Result, ShippingAddress } = require("../data_models");
const fetch = require("node-fetch");

/**
 * Evaluate the shipping address quality, return validated address and conclusion on quality
 * @param {ShippingAddress} shippingAddress - The address to be validated.
 * @returns { GoogleAddressValidation, Conclusion } - The processed address and api verdict.
 */
async function evaluateShippingAddressQuality(shippingAddress) {
    const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${ process.env.GOOGLE_MAP_API }`;
    const customerShippingAddress = {
        address: {
            revision: 0,
            regionCode: "CA",
            postalCode: shippingAddress.postcode || '',
            locality: shippingAddress.city || '',
            administrativeArea: shippingAddress.province || '',
            addressLines: [shippingAddress.address_01 || '', shippingAddress.address_02 || ''],
        },
        previousResponseId: "",
    };
    try {
        const fetchResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(customerShippingAddress),
        });
        const fetchResponseData = await fetchResponse.json();
        const result = fetchResponseData.result;
        const conclusion = generateConclusionString(result);
        return { result, conclusion };
    } catch (error) {
        throw new Error(`Impossible de valider votre adresse: ${error}`);
    }
}

/**
 * Process the API verdict logic and return a conclusion
 * @param {Result} result - Data containing address quality.
 * @return {Conclusion} - A string expressing the verdict.
 */
function generateConclusionString(result) {
    const validationGranularity = result.verdict.validationGranularity;
    const isComplete = result.verdict.addressComplete;
    const isUnconfirmed = result.verdict.hasUnconfirmedComponents;
    const isModified = result.verdict.hasInferredComponents || result.verdict.hasReplacedComponents;
    const isAddressFinalized = isComplete && !isUnconfirmed && !isModified;
    const highConfidence = new Set(['PREMISE', 'SUB_PREMISE', 'GRANULARITY_UNSPECIFIED']);
    if (!isComplete) {
        return Conclusion.FIX;
    } else if (isModified) {
        return Conclusion.SELECT;
    } else if (highConfidence.has(validationGranularity) && isAddressFinalized) {
        return Conclusion.ACCEPT;
    } else {
        return Conclusion.CONFIRM;
    }
}

    /**
     * Reduces an array of address components into an object, where the component type is the key and the component
     * name is the value.
     *
     * @param {Result} result - The array of address components to be reduced.
     * @returns {ShippingAddress} - The resulting object with component types as keys and component names as values.
     */
function generateShippingAddress(result) {
    const addressComponents = result.address.addressComponents;
    const data = addressComponents.reduce((acc, cur) => {
        acc[cur.componentType] = cur.componentName;
        return acc;
    }, {});
    console.log('generateShippingAddress data', data)
    return {
        address_01: `${data.street_number} ${data.route}`,
        address_02: `${data}` || "",
        city: data.locality.text,
        province: data.administrative_area_level_1.text,
        postcode: data.postal_code,
        country: data.country.text,
    };
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