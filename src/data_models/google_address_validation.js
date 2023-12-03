/**
 * @class
 */
class GoogleAddressValidation {
    /**
     * @description: GoogleAddressValidation
     * @param {Result} result
     * @param {Conclusion} conclusion
     */
    constructor(result, conclusion) {
        this.result = result;
        this.conclusion = conclusion;
    }
}

class Result {
    /**
     * @param {Verdict} verdict -
     * @param {Address} address -
     * @param {Geocode} geocode -
     * @param {Metadata} metadata -
     */
    constructor(verdict, address, geocode, metadata) {
        this.verdict = verdict;
        this.address = address;
        this.geocode = geocode;
        this.metadata = metadata;
    }
}

class Verdict {
    /**
     * @description: Verdict
     * @param {string} inputGranularity - indicate how fine a granularity the address identifies a mailing destination
     * @param {string} validationGranularity - indicate how fine a granularity the address identifies a destination
     * @param {string} geocodeGranularity
     * @param {boolean} addressComplete - address is considered complete if there are no missing tokens
     * @param {boolean} [hasInferredComponents] - at least one component was added that wasn't in the input
     * @param {boolean} [hasReplacedComponents] - at least one address component was replaced
     * @param {boolean} [hasUnconfirmedComponents] - at least one address component cannot be categorized or validated
     */
    constructor(inputGranularity, validationGranularity, geocodeGranularity, addressComplete, hasInferredComponents, hasReplacedComponents, hasUnconfirmedComponents) {
        this.inputGranularity = inputGranularity;
        this.validationGranularity = validationGranularity;
        this.geocodeGranularity = geocodeGranularity;
        this.addressComplete = addressComplete;
        this.hasInferredComponents = hasInferredComponents;
        this.hasReplacedComponents = hasReplacedComponents;
        this.hasUnconfirmedComponents = hasUnconfirmedComponents;
    }
}

class Address {
    /**
     * @param {string} formattedAddress - the address formatted in a single line
     * @param {PostalAddress} postalAddress - formatted elements making up the formatted address
     * @param {Array.<AddressComponent>} addressComponents - an array of address elements
     */
    constructor(formattedAddress, postalAddress, addressComponents) {
        this.formattedAddress = formattedAddress;
        this.postalAddress = postalAddress;
        this.addressComponents = addressComponents;
    }
}

class PostalAddress {
    /**
     * @param {string} regionCode - country
     * @param {string} languageCode - language (fr-CA)
     * @param {string} postalCode -
     * @param {string} administrativeArea - province or territory
     * @param {string} locality - city, village, etc.
     * @param {Array.<string>} addressLines - array of one or two lines
     */
    constructor(regionCode, languageCode, postalCode, administrativeArea, locality, addressLines) {
        this.regionCode = regionCode;
        this.languageCode = languageCode;
        this.postalCode = postalCode;
        this.administrativeArea = administrativeArea;
        this.locality = locality;
        this.addressLines = addressLines;
    }
}

class AddressComponent {
    /**
     * @param {ComponentName} componentName -
     * @param {string} componentType -
     * @param {string} confirmationLevel -
     */
    constructor(componentName, componentType, confirmationLevel) {
        this.componentName = componentName;
        this.componentType = componentType;
        this.confirmationLevel = confirmationLevel;
    }
}

class ComponentName {
    /**
     * @param {string} text -
     * @param {string} languageCode -
     */
    constructor(text, languageCode) {
        this.text = text;
        this.languageCode = languageCode;
    }
}

class Geocode {
    /**
     * @param {Object} location
     * @param {Object} plusCode
     * @param {Object} bounds
     * @param {string} placeId
     * @param {Array} placeTypes
     */
    constructor(location, plusCode, bounds, placeId, placeTypes) {
        this.location = location;
        this.plusCode = plusCode;
        this.bounds = bounds;
        this.placeId = placeId;
        this.placeTypes = placeTypes;
    }
}

/**
 * @enum
 */
const Conclusion = Object.freeze({
    ACCEPT: "accept",
    CONFIRM: "confirm",
    SELECT: "select",
    FIX: "fix",
});

module.exports = { GoogleAddressValidation, Verdict, AddressComponent, Conclusion, Result };
