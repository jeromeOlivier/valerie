// Description: This file contains the handlers for GET requests.
/**
 * @description The express module.
 * @type {expressAsyncHandler | (<P=ParamsDictionary, ResBody=any, ReqBody=any, ReqQuery=Query>(handler: (...args:
 *   Parameters<e.RequestHandler<P, ResBody, ReqBody, ReqQuery>>) => (void | Promise<void>)) => e.RequestHandler<P,
 *   ResBody, ReqBody, ReqQuery>)}
 */
const asyncHandler = require("express-async-handler");
/**
 * @description array of valid pages
 * @type {[]}
 */
const validUrls = require("../utils/validUrls");
/**
 * @description The validFormats variable book format.
 * @type {Set<string>}
 */
const validFormats = require("../utils/validFormats");
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
const index = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validUrls);
});
const data_index = asyncHandler(async(req, res) => {
  getStaticData(req, res, validUrls);
});

// GET CONTACT
const contact = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validUrls);
});
const data_contact = asyncHandler(async(req, res) => {
  getStaticData(req, res, validUrls);
});

// GET SERVICE
const service = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validUrls);
});
const data_service = asyncHandler(async(req, res) => {
  getStaticData(req, res, validUrls);
});

// GET WORD, EXCEL, POWERPOINT, OUTLOOK
const book = asyncHandler(async(req, res) => getBook(req, res, validUrls, validFormats));

// GET BLOG
const blog = asyncHandler(async(req, res) => {
  await res.render("layout", { main: "data_blog", contact: contact });
});
const data_blog = asyncHandler(async(req, res) => {
  getBlogData(req, res, validUrls);
});

// GET PANIER
const panier = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validUrls);
});
const data_panier = asyncHandler(async(req, res) => {
  getStaticData(req, res, validUrls);
});

// GET BOOK FORMAT
const book_format = asyncHandler(async(req, res) => {
  const title = req.params.title;
  const format = req.params.format;
  const result = await getBookFormat(title, format, validFormats);
  console.log("result:", result);
  res.render("book_format", { book_format: result });
});

// handler for full page renders
async function getStaticLayout(req, res, validPages) {
  try {
    if (req && typeof req.url === "string") {
      const page = validPages.find((page) => page.path === req.url);
      if (page) {
        await res.render("layout", { main: page.file });
      } else {
        await res.render("layout", { main: "index" });
      }
    } else {
      throw new Error("Invalid Request");
    }
  } catch (err) {
    res.status(500).send("Layout render error");
  }
}

// handler for data injected into layout using AJAX calls
async function getStaticData(req, res, validPages) {
  try {
    if (req && typeof req.url === "string") {
      const valid = validPages.find((page) => page.path === req.url);
      if (valid) {
        res.render(valid.file);
      } else {
        res.render("not_found");
      }
    } else {
      throw new Error("Invalid Request URL");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}

async function getBook(req, res, validUrls, validFormats) {
  if (req && typeof req.url === "string") {
    try {
      // validate the query parameters over the whitelist to prevent injection
      const selection = validUrls.find((s) => s.path === req.url);
      // if selection is invalid or does not contain a book title...
      if (!selection?.title) throw new Error("Book not found");

      // get the book and format the id for pdf (the default format)
      const [[book]] = await db.query(`SELECT * FROM books WHERE title = '${ selection.title }';`);
      console.log("book:", book);
      if (book.length === 0) throw new Error("Book not found");

      // get format. book page load initially defaults to pdf
      const title = book.title.toLowerCase();
      const format = "pdf";
      const book_format = await getBookFormat(title, format, validFormats);
      console.log("book format:", book_format);

      // const [workbooks] = await db.query(`SELECT * FROM workbooks WHERE book_id = '${ book.id }';`);
      // const getWorkbookPreviews = getWorkbooks.map((workbook) => {
      //   db.query(`SELECT *
      //                    FROM book_formats
      //                    WHERE book_id = '${ workbook.id }'
      //                      AND format = '${ format.id }';`);
      // });
      // const [workbookPreviews] = await Promise.all(getWorkbookPreviews);
      // console.log(workbookPreviews);

      // disconnect from the database
      db.disconnect;

      // render the data_book with or without layout
      if (selection.full) {
        res.render("layout", { main: "book", book, book_format });
      } else {
        res.render("book", { book, book_format });
      }
    } catch (err) {
      res.status(500).send(`Internal Server Error`);
    }
  } else {
    console.log("Database query failed");
  }
}

async function getBookFormat(title, format, validFormats) {
  console.log("title:", title);
  console.log("format:", format);
  try {
    console.log("inside try");
    // validate the query parameters
    const isValidTitle = validFormats.has(title);
    console.log("isValidTtle:", isValidTitle);
    const isValidFormat = validFormats.has(format);
    console.log("isValidFormat:", isValidFormat);

    // if (!isValidTitle) throw new Error("Invalid request");

    // get the book and format ids
    const getBookId = db.query(`SELECT id FROM books WHERE title = '${ title }';`);
    const getFormatId = db.query(`SELECT id FROM formats WHERE name = '${ format }';`);
    const [[[book_id]], [[format_id]]] = await Promise.all([getBookId, getFormatId]);
    if (!book_id) throw new Error("Book id not found");
    if (!format_id) throw new Error("Format id not found");

    // get the book format data
    const [[book_format]] = await db.query(
      `SELECT * FROM book_formats WHERE book_id = '${ book_id.id }' AND format = '${ format_id.id }';`,
    );
    if (!book_format) throw new Error("Book format not found");
    console.log("book_format:", book_format);

    // get the language and market values
    const getLanguage = db.query(`SELECT name FROM languages WHERE id = '${ book_format.language }';`);
    const getMarket = db.query(`SELECT name FROM market_coverage WHERE id = '${ book_format.market }';`);
    const [[[language]], [[market]]] = await Promise.all([getLanguage, getMarket]);
    console.log("language:", language);
    console.log("market:", market);
    if (!language || !market) throw new Error("Language or market not found");

    // disconnect from the database
    db.disconnect;

    // set the language, market, and title values to book_format
    book_format.language = language?.name;
    book_format.market = market?.name;
    book_format.name = format;
    book_format.title = title[0].toUpperCase() + title.slice(1);

    // return book_format
    return book_format;
  } catch (err) {
    throw new Error(`Book format not found: ${ err }`);
  }
}

module.exports = {
  data_index,
  index,
  blog,
  data_blog,
  contact,
  data_contact,
  panier,
  data_panier,
  book,
  service,
  data_service,
  book_format,
};

// path: src/handlers/get.js
