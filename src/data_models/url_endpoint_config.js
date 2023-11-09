/**
 * Description: This file contains an array of Path objects that represent a whitelist of valid pages.
 * @type {Array.<Path>}
 */
const url_endpoint_config = [
  { path: "/", file: "index", full: true },
  { path: "/data_index", file: "index", full: false },
  { path: "/blog", file: "blog", full: true },
  { path: "/data_blog", file: "blog", full: false },
  { path: "/contact", file: "contact", full: true },
  { path: "/data_contact", file: "contact", full: false },
  { path: "/excel", title: "Excel", full: true },
  { path: "/data_excel", title: "Excel", full: false },
  { path: "/outlook", file: "data_outlook", title: "Outlook", full: true },
  { path: "/data_outlook", file: "data_outlook", title: "Outlook", full: false },
  { path: "/cart", file: "cart", full: false },
  { path: "/politique", file: "politique", full: true },
  { path: "/data_politique", file: "politique", full: false },
  { path: "/powerpoint", file: "data_powerpoint", title: "PowerPoint", full: true },
  { path: "/data_powerpoint", file: "data_powerpoint", title: "PowerPoint", full: false },
  { path: "/service", file: "service", full: true },
  { path: "/data_service", file: "service", full: false },
  { path: "/word", file: "data_word", title: "Word", full: true },
  { path: "/data_word", file: "data_word", title: "Word", full: false },
];
module.exports = url_endpoint_config;
// path: src/data_models/url_endpoint_config.js
