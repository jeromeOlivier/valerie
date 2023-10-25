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

// STATIC: GET INDEX
const index = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validPages);
});
const data_index = asyncHandler(async(req, res) => {
  getStaticData(req, res, validPages);
});

// STATIC: GET CONTACT
const contact = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validPages);
});
const data_contact = asyncHandler(async(req, res) => {
  getStaticData(req, res, validPages);
});

// STATIC: GET SERVICE
const service = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validPages);
});
const data_service = asyncHandler(async(req, res) => {
  getStaticData(req, res, validPages);
});

// DYNAMIC: GET WORD
const book = asyncHandler(async(req, res) => {
  getBook(req, res, validPages);
});
// const data_word = asyncHandler(async(req, res) => {
//   getBook(req, res, validPages);
// });

// DYNAMIC: GET EXCEL
const excel = asyncHandler(async(req, res) => {
  getBook(req, res, validPages);
});
const data_excel = asyncHandler(async(req, res) => {
  getStaticData(req, res, validPages);
});

// DYNAMIC: GET POWERPOINT
const powerpoint = asyncHandler(async(req, res) => {
  getBook(req, res, validPages);
});
const data_powerpoint = asyncHandler(async(req, res) => {
  getStaticData(req, res, validPages);
});

// DYNAMIC: GET OUTLOOK
const outlook = asyncHandler(async(req, res) => {
  getBook(req, res, validPages);
});
const data_outlook = asyncHandler(async(req, res) => {
  getStaticData(req, res, validPages);
});

// DYNAMIC: GET BLOG
const blog = asyncHandler(async(req, res) => {
  await res.render("layout", { main: "data_blog", contact: contact });
});
const data_blog = asyncHandler(async(req, res) => {
  getBlogData(req, res, validPages);
});

// DYNAMIC: GET PANIER
const panier = asyncHandler(async(req, res) => {
  getStaticLayout(req, res, validPages);
});
const data_panier = asyncHandler(async(req, res) => {
  getStaticData(req, res, validPages);
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

async function getBook(req, res, validPages) {
  if (req && typeof req.url === "string") {
    try {
      const page = validPages.find((page) => page.path === req.url);
      // if page is invalid or page does not contain the book attribute...
      if (!page?.book) throw new Error("Page not found");
      console.log(page.full);
      // get the book and format the id for pdf (the default format)
      const getBook = db.query(`SELECT *
                                FROM books
                                WHERE title = '${ page.book }';`);
      const getFormatId = db.query(`SELECT id
                                    FROM formats
                                    WHERE name = 'pdf';`);
      const [[[book]], [[format]]] = await Promise.all([getBook, getFormatId]);
      if (!book) throw new Error("Book not found");

      // get the data for the format table
      const [[book_format]] =
        await db.query(`SELECT *
                        FROM book_formats
                        WHERE book_id = '${ book.id }'
                          AND format = '${ format.id }';`);

      // get the value for language and market
      const getLanguage = db.query(`SELECT name
                                    FROM languages
                                    WHERE id = '${ book_format.language }';`);
      const getMarket = db.query(`SELECT name
                                  FROM market_coverage
                                  WHERE id = '${ book_format.market }';`);
      const [[[language]], [[market]]] = await Promise.all([getLanguage, getMarket]);
      if (!language || !market) throw new Error("Language or market not found");

      // set the language and market values
      book_format.language = language?.name;
      book_format.market = market?.name;

      const [workbooks] = await db.query(`SELECT *
                                           FROM workbooks
                                           WHERE book_id = '${ book.id }';`);
      console.log(workbooks);
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
      if (page.full) {
        res.render("layout", {
          main: "data_book",
          book: book,
          book_format: book_format,
        });
      } else {
        res.render("data_book", {
          book: book,
          book_format: book_format,
        });
      }
    } catch (err) {
      res.status(500).send(`Internal Server Error`);
    }
  } else {
    console.log("Database query failed");
  }
}

async function getBookData(req, res, validPages) {}

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
};

// path: src/handlers/get.js
