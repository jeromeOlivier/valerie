/**
 * postcode_services module
 * @module services/postcode_services
 */

module.exports = {
    getPostcodeFromRequestBodyOrCookie,
    calculateShippingUsingPostcode,
    checkIfPostcodeIsRequired,
    confirmCustomerAddress,
};

const fetch = require("node-fetch");
const xml2js = require("xml2js");
const { calculateTotalWeightOfItems, isAnyCartItemPaperFormat } = require("./cart_services");

/**
 * Formats the given postcode and updates the specified cookie value with the formatted postcode.
 * @param {Request} req - The request object that contains the postcode to be formatted.
 * @return {string} - The formatted postcode, or undefined if the postcode is invalid.
 */
function getPostcodeFromRequestBodyOrCookie(req) {
    const data = req.body.postcode || req.cookies.postcode;
    // remove spaces, single and double quotation marks
    if (!data) { return undefined; }
    const postcode = data.replace(/[\s"']/g, "").toUpperCase();
    // validate structure
    const regex = /^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/;
    const isValid = regex.test(postcode);
    if (isValid) {
        return postcode;
    }
    return undefined;
}

/**
 * Fetches the shipping estimate based on the given postcode and weight.
 * @param {string} postcode - The destination postcode.
 * @param {number} weight - The weight of the parcel in grams.
 * @return {Promise<number>} - The shipping price in CAD.
 * @throws {Error} - If there is an error in fetching the shipping estimate.
 */
async function fetchShippingEstimateBasedOnPostCodeAndWeight(postcode, weight) {
    // API URL
    const url = "https://ct.soa-gw.canadapost.ca/rs/ship/price";
    const grams = weight / 1000;

    // XML Body data
    const data = `
        <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
            <customer-number>${ process.env.CANADA_POST_CLIENT_NUMBER }</customer-number>
            <parcel-characteristics>
                <weight>${ grams }</weight>
            </parcel-characteristics>
            <origin-postal-code>${ process.env.CANADA_POST_SENDER_POSTCODE }</origin-postal-code>
            <destination>
                <domestic>
                    <postal-code>${ postcode.match(/[A-Z0-9]{6}/) }</postal-code>
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
        const serviceData = json["price-quotes"]["price-quote"];
        const regularParcel = serviceData.filter(service => service["service-code"][0] === "DOM.RP")[0];
        const [shippingPrice] = regularParcel["price-details"][0]["due"];
        return shippingPrice;
    } else if(response.status >= 500 && response.status < 600) {
        throw new Error(`Le service de Postes Canada est actuellement indisponible. Veuillez réessayer plus tard.`);
    } else {
        throw new Error(`Échec de récupération du coût de livraison.: HTTP ${response.status}`);
    }
}

/**
 * Confirms the customer's address.
 *
 * @param {Request} req - The request object.
 * @param {Request} res - The response object.
 * @return {Promise<void>} - A promise that resolves with no value.
 */
async function confirmCustomerAddress(req, res) {

}

/**
 * Calculate the shipping cost based on the given postcode.
 * @param {Array.<CartItem>} cartItems - cart items.
 * @param {string} postcode - The postcode to calculate the shipping for.
 * @return {Promise<string>} - A promise that resolves to the total shipping cost.
 */
async function calculateShippingUsingPostcode(cartItems, postcode) {
    // special conditions: if only outlook, or powerpoint, it won't be calculated as a parcel
    const onlyOutlook = cartItems.length === 1 && cartItems[0].title === "Outlook";
    const onlyPowerpoint = cartItems.length === 1 && cartItems[0].title === "Powerpoint";
    if (postcode === undefined) {
        return "";
    } else {
        const weightAndItems = await calculateTotalWeightOfItems(cartItems);
        // get the shipping estimate
        let shippingEstimate;
        if (onlyOutlook) {
            shippingEstimate = '5.00';
        } else if (onlyPowerpoint) {
            shippingEstimate = '6.50';
        } else {
            shippingEstimate = await fetchShippingEstimateBasedOnPostCodeAndWeight(postcode, weightAndItems.weight);
        }
        // calculate total based on canada post estimate plus $3 or $5 envelope
        let totalShipping;
        if (weightAndItems.numberOfItems > 1) {
            totalShipping = (((Number(shippingEstimate) * 100) + 500) / 100).toFixed(2);
        } else {
            totalShipping = (((Number(shippingEstimate) * 100) + 300) / 100).toFixed(2);
        }
        return totalShipping;
    }
}

/**
 * Checks if postcode is required based on the cart items and the provided postcode.
 * Returns true if postcode is required, false otherwise.
 * @param {Array.<CartItem>} cartItems - An array of cart items.
 * @param {string} postcode - The postcode provided by the user.
 * @returns {boolean} - Returns true if postcode is required, false otherwise.
 */
function checkIfPostcodeIsRequired(cartItems, postcode) {
    return isAnyCartItemPaperFormat(cartItems) && postcode === undefined;
}

// async function sanitizeShippingAddress(customer) {
//     // process address logic here
//     // if address sanitation makes changes, send confirmation to customer
//     // return
//     // else await saveCustomerInfo()
//     // return customer
// }
