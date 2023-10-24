const asyncHandler = require("express-async-handler");
/**
 * @description array of valid pages
 * @type {[]}
 */
const validPages = require("../utils/validPages");
/**
 * @description The `db` variable represents the database utility.
 *
 * @type {Object}
 * @property {function} connect - A function to connect to the database.
 * @property {function} disconnect - A function to disconnect from the database.
 * @property {function} query - A function to execute a database query.
 */
const db = require("../utils/database");

// GET INDEX
const index = asyncHandler(async (req, res) =>
  getStaticLayout(req, res, validPages),
);
const data_index = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);
// GET BLOG
const blog = asyncHandler(async (req, res) => {
  const [contact] = await db.query("SELECT * FROM customers");
  await res.render("layout", { main: "data_blog", contact: contact });
});
const data_blog = asyncHandler(async (req, res) =>
  getBlogData(req, res, validPages),
);
// GET CONTACT
const contact = asyncHandler(async (req, res) =>
  getStaticLayout(req, res, validPages),
);
const data_contact = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);
// GET EXCEL
const excel = asyncHandler(async (req, res) =>
  getStaticLayout(req, res, validPages),
);
const data_excel = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);
// GET OUTLOOK
const outlook = asyncHandler(async (req, res, validPages) => {
  const [customers] = db.query("SELECT * FROM customers");
  console.log(customers);
  getStaticLayout(req, res);
});
const data_outlook = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);
// GET PANIER
const panier = asyncHandler(async (req, res) =>
  getStaticLayout(req, res, validPages),
);
const data_panier = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);
// GET POWERPOINT
const powerpoint = asyncHandler(async (req, res) =>
  getStaticLayout(req, res, validPages),
);
const data_powerpoint = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);
// GET SERVICE
const service = asyncHandler(async (req, res) =>
  getStaticLayout(req, res, validPages),
);
const data_service = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);
// GET WORD
const word = asyncHandler(async (req, res) => {
  console.log("hello");
  getStaticLayout(req, res, validPages);
});
const data_word = asyncHandler(async (req, res) =>
  getStaticData(req, res, validPages),
);

// helper functions
// handler for full page renders
async function getStaticLayout(req, res, validPages) {
  console.log(req.url);
  try {
    if (req && typeof req.url === "string") {
      const page = validPages.find((page) => page.path === req.url);
      console.log(page);
      if (page) {
        await res.render("layout", { main: page.file });
      } else {
        await res.render("layout", { main: "index" });
      }
    } else {
      throw new Error("Invalid Request");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Layout render error");
  }
}

// handler for data injected into layout using AJAX calls
async function getStaticData(req, res, validPages) {
  try {
    if (req && typeof req.url === "string") {
      const page = validPages.find((page) => page.path === request);
      if (page) {
        await res.render(page.file);
      } else {
        await res.render("not_found");
      }
    } else {
      throw new Error("Invalid Request URL");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Data injection error");
  }
}

function getBookLayout(req, res, validPages) {}

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

// path: src/handlers/get.js
