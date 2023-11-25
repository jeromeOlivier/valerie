/**
 * Description: This view contains an array of Path objects that represent a whitelist of valid pages.
 * @type {Array.<Path>}
 */
const url_endpoint_config = [
    { path: "/", view: "index", full: true },
    { path: "/data_index", view: "index", full: false },
    { path: "/blog", view: "blog", full: true },
    { path: "/data_blog", view: "blog", full: false },
    { path: "/contact", view: "contact", full: true },
    { path: "/data_contact", view: "contact", full: false },
    { path: "/excel", title: "Excel", full: true },
    { path: "/data_excel", title: "Excel", full: false },
    { path: "/outlook", view: "data_outlook", title: "Outlook", full: true },
    { path: "/data_outlook", view: "data_outlook", title: "Outlook", full: false },
    { path: "/cart", view: "cart", full: false },
    { path: "/politique", view: "politique", full: true },
    { path: "/data_politique", view: "politique", full: false },
    { path: "/powerpoint", view: "data_powerpoint", title: "PowerPoint", full: true },
    { path: "/data_powerpoint", view: "data_powerpoint", title: "PowerPoint", full: false },
    { path: "/service", view: "service", full: true },
    { path: "/data_service", view: "service", full: false },
    { path: "/word", view: "data_word", title: "Word", full: true },
    { path: "/data_word", view: "data_word", title: "Word", full: false },
    // checkouts
    { path: "/caisse", view: "data_checkout", full: true },
    { path: "/data_caisse", view: "data_checkout", full: false },
];
module.exports = url_endpoint_config;

// path: src/data_models/url_endpoint_config.js
