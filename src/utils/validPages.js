// Array of valid pages.
// path: the url path.
// file: the content to be rendered.
// full: a boolean that determines how the content should be rendered. if
// false, the content of the page's main element will be swapped with the
// new content. if true, the file will be injected into layout and a full
// page render will be executed.
module.exports = [
  { path: "/", file: "data_index", full: true },
  { path: "/data_index", file: "data_index", full: false },
  { path: "/blog", file: "data_blog", full: true },
  { path: "/data_blog", file: "data_blog", full: false },
  { path: "/contact", file: "data_contact", full: true },
  { path: "/data_contact", file: "data_contact", full: false },
  { path: "/excel", file: "data_excel", full: true },
  { path: "/data_excel", file: "data_excel", full: false },
  { path: "/formation", file: "data_formation", full: true },
  { path: "/data_formation", file: "data_formation", full: false },
  { path: "/outlook", file: "data_outlook", full: true },
  { path: "/data_outlook", file: "data_outlook", full: false },
  { path: "/panier", file: "data_panier", full: true },
  { path: "/data_panier", file: "data_panier", full: false },
  { path: "/politique", file: "data_politique", full: true },
  { path: "/data_politique", file: "data_politique", full: false },
  { path: "/powerpoint", file: "data_powerpoint", full: true },
  { path: "/data_powerpoint", file: "data_powerpoint", full: false },
  { path: "/service", file: "data_service", full: true },
  { path: "/data_service", file: "data_service", full: false },
  { path: "/word", file: "data_word", full: true },
  { path: "/data_word", file: "data_word", full: false },
];
// path: src/utils/validPages.js
