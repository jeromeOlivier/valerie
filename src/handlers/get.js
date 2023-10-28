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

// fetch book data
async function getBook(req, res, validUrls, validFormats) {
  if (req && typeof req.url === "string") {
    try {
      // validate the query parameters over the whitelist to prevent injection
      const selection = validUrls.find((s) => s.path === req.url);
      // if selection is invalid or does not contain a book title...
      if (!selection?.title) throw new Error("Book not found");

      // get the book and format the id for pdf (the default format)
      const [[book]] = await db.query(`
          SELECT * FROM books WHERE title = '${ selection.title }';
      `);
      db.disconnect;
      console.log("book:", book);
      if (book.length === 0) throw new Error("Book not found");

      // get format. book page load initially defaults to pdf
      const title = book.title.toLowerCase();
      const format = "pdf";
      const book_format = await getBookFormat(title, format, validFormats);

      if (book.workbook_desc) book.workbooks = await getWorkbooks(title);

      console.log("book_format:", book_format, "book:", book, "workbooks:", book.workbooks[0].content[0]);

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
  // validate the query parameters
  const isValidTitle = validFormats.has(title);
  const isValidFormat = validFormats.has(format);
  const capitalizedTitle = title[0].toUpperCase() + title.slice(1);
  if (!isValidTitle || !isValidFormat) throw new Error(
    `Votre recherche n'est pas valide. Cette action, incluant votre address IP, a été enregistrée et sera examinée d'ici peux. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'équipe de support.`);

  // get the book format data
  const [[book_format]] = await db.query(`
      SELECT b.title     AS title,
             bf.pub_date AS date,
             f.name      AS type,
             bf.size     AS size,
             bf.pages    AS pages,
             l.name      AS language,
             m.name      AS market,
             bf.price    AS price
      FROM book_formats bf
               JOIN books b ON bf.book_id = b.id
               JOIN formats f ON f.id = bf.format
               JOIN languages l ON l.id = bf.language
               JOIN market_coverage m ON m.id = bf.market
      WHERE b.title = '${ capitalizedTitle }'
        AND f.name = '${ format }';
  `);
  if (!book_format) throw new Error("Book format not found");
  db.disconnect;

  return book_format;
}

async function getWorkbooks(title) {
  // get the workbooks for the book
  const [query] = await db.query(
    `SELECT wb.title       AS title,
            wb.seq_order   AS sequence,
            wp.description AS description,
            wp.path        AS path,
            wp.level       AS level
     FROM books b
              JOIN workbooks wb ON wb.book_id = b.id
              JOIN workbook_previews wp ON wb.id = wp.workbook_id
     WHERE b.title = '${ title }'
     ORDER BY b.id, sequence, path + '.';`);
  db.disconnect;

  // group the workbooks by title, add the description and level to the content array
  // and sort the content array by path
  const result = query.reduce((accumulator, current) => {
    // find an object in accumulator array having the same title as the current object
    let obj = accumulator.find(item => item.title === current.title);

    if (!obj) {
      // if such an object does not exist in accumulator yet, create one
      obj = {
        title: current.title,
        content: [],
      };
      // and push it to the accumulator
      accumulator.push(obj);
    }

    // push the description to the content array of the found (or just created) object
    obj.content.push({
      description: current.description,
      level: current.level,
    });

    // sort the content array by path
    obj.content.sort((a, b) => a.path - b.path);

    return accumulator;
  }, []);
  return result;
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
