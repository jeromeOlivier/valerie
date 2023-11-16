const fetch = require('node-fetch');
const xml2js = require('xml2js');
const { calculateTotalWeightOfItems } = require("./cart_services")

/**
 * Formats the given postcode and updates the specified cookie value with the formatted postcode.
 *
 * @param {Request} req - The request object that contains the postcode to be formatted.
 * @return {string } - The formatted postcode, or undefined if the postcode is invalid.
 */
function formatPostcode(req) {
    const data = req.body.postcode || req.cookies.postcode;
    // remove spaces, quotation marks, convert to uppercase
    if (data) {
        const postcode = data.replace(/\s"'/g, "").toUpperCase();
        // validate structure
        const regex = /[A-Z][0-9][A-Z][0-9][A-Z][0-9]/;
        const isValid = regex.test(postcode)
        if (isValid) {
            return postcode;
        }
    } else {
        return undefined;
    }
}

/**
 * Fetches the shipping estimate based on the given postal code and weight.
 *
 * @param {string} postcode - The destination postal code.
 * @param {number} weight - The weight of the parcel in grams.
 * @returns {Promise<number>} - The shipping price in CAD or an error if the request fails.
 */
async function fetchShippingEstimateBasedOnPostCodeAndWeight(postcode, weight) {
    // API URL
    const url = "https://ct.soa-gw.canadapost.ca/rs/ship/price";
    const grams = weight / 1000;
    // XML Body data
    const data = `
        <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
            <customer-number>${process.env.CANADA_POST_CLIENT_NUMBER}</customer-number>
            <parcel-characteristics>
                <weight>${grams}</weight>
            </parcel-characteristics>
            <origin-postal-code>${process.env.CANADA_POST_ORIGIN_POSTCODE}</origin-postal-code>
            <destination>
                <domestic>
                    <postal-code>${postcode.match(/[A-Z0-9]+/)}</postal-code>
                </domestic>
            </destination>
        </mailing-scenario>
    `;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/vnd.cpc.ship.rate-v4+xml",
            "Accept": "application/vnd.cpc.ship.rate-v4+xml",
            "Authorization": "Basic " + Buffer.from(process.env.CANADA_POST_USER_DEV + ":" + process.env.CANADA_POST_PASSWORD_DEV)
                                              .toString("base64"),
        },
        body: data,
    });

    if (response.status === 200) {
        let xmlData = await response.text();
    const json = await xml2js.parseStringPromise(xmlData, { mergeAttrs: true });
        const serviceData = json['price-quotes']['price-quote'];
        const regularParcel = serviceData.filter(service => service['service-code'][0] === 'DOM.RP')[0];
        const [ shippingPrice ] = regularParcel['price-details'][0]['due'];
        return shippingPrice;
    } else {
        console.error(`Canada Post Error: status(${response.status}), ${response}`);
    }
}

/**
 * Calculate the shipping cost based on the given postcode.
 *
 * @param {Request} req - The request object.
 * @param {string} postcode - The postcode to calculate the shipping for.
 * @return {Promise<string>} - A promise that resolves to the total shipping cost.
 */
async function calculateShippingUsingPostcode(req, postcode) {
    const weightAndItems = await calculateTotalWeightOfItems(req.cookies);
    // get the shipping estimate
    const shippingEstimate = await fetchShippingEstimateBasedOnPostCodeAndWeight(postcode, weightAndItems.weight);
    // calculate total based on canada post estimate plus $3 or $5 envelope
    let totalShipping;
    if (weightAndItems.numberOfItems > 1) {
        totalShipping = (((Number(shippingEstimate) * 100) + 500) / 100).toFixed(2);
    } else {
        totalShipping = (((Number(shippingEstimate) * 100) + 300) / 100).toFixed(2);
    }
    return totalShipping;
}

module.exports = {
    formatPostcode,
    calculateShippingUsingPostcode,
};
