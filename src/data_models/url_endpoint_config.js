/**
 * Description: This view contains an array of Configuration objects that represent a whitelist of valid endpoints.
 * @type {Array.<Configuration>}
 */

/**
 * Array of URL endpoint configurations.
 * @type {Array<Configuration>}
 */
const url_endpoint_config = [
    { path: "/", view: "index", full: true },
    { path: "/swap_index", view: "index", full: false },
    { path: "/blog", view: "blog", full: true },
    { path: "/swap_blog", view: "blog", full: false },
    { path: "/contact", view: "contact", full: true },
    { path: "/swap_contact", view: "contact", full: false },
    { path: "/excel", title: "Excel", full: true },
    { path: "/swap_excel", title: "Excel", full: false },
    { path: "/outlook", view: "swap_outlook", title: "Outlook", full: true },
    { path: "/swap_outlook", view: "swap_outlook", title: "Outlook", full: false },
    { path: "/cart", view: "cart", full: false },
    { path: "/politique", view: "politique", full: true },
    { path: "/swap_politique", view: "politique", full: false },
    { path: "/powerpoint", view: "swap_powerpoint", title: "PowerPoint", full: true },
    { path: "/swap_powerpoint", view: "swap_powerpoint", title: "PowerPoint", full: false },
    { path: "/service", view: "service", full: true },
    { path: "/swap_service", view: "service", full: false },
    { path: "/word", view: "swap_word", title: "Word", full: true },
    { path: "/swap_word", view: "swap_word", title: "Word", full: false },
    { path: "/caisse", view: "swap_checkout", full: true },
    { path: "/swap_caisse", view: "swap_checkout", full: false },
];
module.exports = url_endpoint_config;
