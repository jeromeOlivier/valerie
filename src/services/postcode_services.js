function formatPostcode(postcode) {
    // remove spaces, convert to uppercase
    return postcode.replace(/\s/g, "").toUpperCase();
}

async function fetchShippingEstimateBasedOnPostCodeAndWeight(vendor, customer, parcel) {
    // API URL
    const url = "https://ct.soa-gw.canadapost.ca/rs/ship/price";

    // XML Body data
    const data = `
        <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
          <origin-postal-code>${vendor.postcode}</origin-postal-code>
            <destination>
                <domestic>
                    <postal-code>${customer.postcode}</postal-code>
                </domestic>
            </destination>
            <options>
                <option>
                    <option-code></option-code>
                </option>
            </options>
            <parcel-characteristics>
                <weight>${parcel.weight}</weight>
            </parcel-characteristics>
            <services>
                <service-code>${parcel.service}</service-code>
            </services>
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
        console.log(xmlData);
    } else {
        console.error("Error:", response.status);
    }
}

module.exports = {
    formatPostcode,
    fetchShippingEstimateBasedOnPostCodeAndWeight,
};

// `<?xml version="1.0"?>
// <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
//     <customer-number>12345</customer-number>
//     <contract-id>6789</contract-id>
//     <promo-code>PROMO2022</promo-code>
//     <quote-type>commercial</quote-type>
//     <expected-mailing-date>2023-10-10</expected-mailing-date>
//     <parcel-characteristics>
//         <weight>4.200</weight>
//     </parcel-characteristics>
//     <origin-postal-code>90505</origin-postal-code>
//     <destination>
//         <domestic>
//             <postal-code>90210</postal-code>
//         </domestic>
//     </destination>
// </mailing-scenario>`

