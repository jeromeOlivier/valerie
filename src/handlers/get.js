const asyncHandler = require("express-async-handler");

// filter to prevent Directory Traversal attacks
const validPages = [
  "/",
  "blog",
  "contact",
  "excel",
  "outlook",
  "panier",
  "powerpoint",
  "service",
  "word",
];

// GET INDEX
const index = asyncHandler(async (req, res) => getLayout(req, res));
const data_index = asyncHandler(async (req, res) => getData(req, res));
// GET BLOG
const blog = asyncHandler(async (req, res) => getLayout(req, res));
const data_blog = asyncHandler(async (req, res) => getData(req, res));
// GET CONTACT
const contact = asyncHandler(async (req, res) => getLayout(req, res));
const data_contact = asyncHandler(async (req, res) => getData(req, res));
// GET EXCEL
const excel = asyncHandler(async (req, res) => getLayout(req, res));
const data_excel = asyncHandler(async (req, res) => getData(req, res));
// GET OUTLOOK
const outlook = asyncHandler(async (req, res) => getLayout(req, res));
const data_outlook = asyncHandler(async (req, res) => getData(req, res));
// GET PANIER
const panier = asyncHandler(async (req, res) => getLayout(req, res));
const data_panier = asyncHandler(async (req, res) => getData(req, res));
// GET POWERPOINT
const powerpoint = asyncHandler(async (req, res) => getLayout(req, res));
const data_powerpoint = asyncHandler(async (req, res) => getData(req, res));
// GET SERVICE
const service = asyncHandler(async (req, res) => getLayout(req, res));
const data_service = asyncHandler(async (req, res) => getData(req, res));
// GET WORD
const word = asyncHandler(async (req, res) => getLayout(req, res));
const data_word = asyncHandler(async (req, res) => getData(req, res));

// helper functions
function getLayout(req, res) {
  const content = req.url;
  if (validPages.includes(content)) {
    res.render("layout", { main: "index" });
  } else {
    res.render("layout", { main: "not_found" });
  }
}

function getData(req, res) {
  const content = req.url;
  if (validPages.includes(content)) {
    res.render("index");
  } else {
    res.render("not_found");
  }
}

module.exports = {
  data_index,
  index,
  blog,
  data_blog,
  contact,
  data_contact,
  excel,
  data_excel,
  outlook,
  data_outlook,
  panier,
  data_panier,
  powerpoint,
  data_powerpoint,
  service,
  data_service,
  word,
  data_word,
};
