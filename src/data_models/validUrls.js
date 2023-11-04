// Array of valid pages, otherwise known as a "whitelist".
// path: the url path.
// file: the content to be rendered.
// full: a boolean that determines how the content should be rendered. if
// false, the content of the page's main element will be swapped with the
// new content. if true, the file will be injected into layout and a full
// page render will be executed.
const validUrls = [
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
module.exports = validUrls;
// path: src/data_models/validUrls.js
