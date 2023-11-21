/**
 * book_services module
 * @module services/book_services
 */

// constants
module.exports = {
    getBook,
    getBookFormat,
    isValidTitleAndType,
};
// dependencies
const { INVALID_QUERY } = require("../constants/messages");
const { IMAGE_PATH } = require("../constants/links");
const db = require("../db_ops/db");
const { url_product_types, Book, Workbook, BookFormat, Path } = require("../data_models");
const { isValidQuery, fetchUrlEndpointConfiguration, isValidPath } = require("./utility_services");
const fs = require("fs");
const path = require("node:path");

/**
 * This function returns the book data for the given path.
 * @param req
 * @param res
 * @returns {Promise<Book>, Path}
 */
async function getBook(req, res) {
    if (!isValidQuery(req)) {
        res.status(500).send(INVALID_QUERY);
        return;
    }
    const path = fetchUrlEndpointConfiguration(req);
    if (!isValidPath(path)) {
        res.status(500).send(INVALID_QUERY);
        return;
    }
    try {
        const book = await getBookData(path);
        return { book, path };
    } catch (error) {
        res.status(500).send(error.message);
    }
}

/**
 * This function returns the book data for the given path.
 * @param {Path} path
 * @returns {Promise<Book>}
 */
const getBookData = async(path) => {
    const book = await fetchBookByTitle(path.title);
    const [bookFormat, workbooks, bookPreviewImages] = await Promise.all([
        getBookFormat(book.title), handleWorkbooks(book), getBookPreviewImages(book.title),
    ]);

    book.format = bookFormat;
    book.workbooks = workbooks;
    book.preview_images = bookPreviewImages;

    return book;
};

/**
 * This function returns relevant data for the given title and format.
 * @param title
 * @param format
 * @returns {Promise<BookFormat>}
 */
async function getBookFormat(title, format = "pdf") {
    // validate the query parameters
    if (!isValidTitleAndType(title, format)) throw new Error(INVALID_QUERY);
    // get the book format data
    const [[query]] = await db.query(`
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
        WHERE b.title = ?
          AND f.name = ?;
    `, [title, format]);
    if (!query) throw new Error(INVALID_QUERY);
    // create a new BookFormat object
    return new BookFormat(query.title, query.date, query.type, query.size, query.pages, undefined, query.language, query.market, query.price);
}

/**
 * This function returns the workbooks for the given title.
 * @param title
 * @returns {Promise<Array.<Workbook>>}
 */
async function getWorkbooks(title) {
    // get the workbooks for the book
    const [query] = await db.query(`
         SELECT wb.title       AS title,
                wb.seq_order   AS sequence,
                wp.description AS description,
                wp.path        AS path,
                wp.level       AS level
         FROM books b
            JOIN workbooks wb ON wb.book_id = b.id
            JOIN workbook_previews wp ON wb.id = wp.workbook_id
         WHERE b.title = ?
         ORDER BY b.id, sequence, path + '.';`, [title]);

    // If no workbooks returned for the book, handle accordingly
    if (!query || query.length === 0) {
        // handle this case
    }

    // group the workbooks by title, add the description and level to the content array
    return query.reduce((accumulator, currentWorkbook) => {
        // find an object in accumulator array having the same title as the current object
        let obj = accumulator.find(item => item.title === currentWorkbook.title);

        if (!obj) {
            // if such an object does not exist in accumulator yet, create one
            obj = {
                title: currentWorkbook.title,
                content: [],
            };
            // and push it to the accumulator
            accumulator.push(obj);
        }

        // push the description to the content array of the found (or just created) object
        obj.content.push({
            description: currentWorkbook.description,
            level: currentWorkbook.level,
        });

        return accumulator;
    }, []);
}

/**
 * This function returns an array of image paths for the given title.
 * @param title
 * @returns {Promise<Array.<Book.preview_images>>}
 */
async function getBookPreviewImages(title) {
    // generate the absolute path to the directory for the book's images
    const directoryPath = path.join(__dirname, `../public/${ IMAGE_PATH }/${ title }`);
    try {
        return new Promise((resolve, reject) => {
            // read the directory
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    reject(`file not found: ${ err }`);
                } else {
                    // filter out non-webp files
                    files = files.filter((file) => (file.endsWith(".webp")));
                    // generate the relative path for each image
                    const images = files.map((file) => `./${ IMAGE_PATH }/${ title }/${ file }`);
                    resolve(images);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

/**
 * This function returns the book data for the given title.
 * @param {string} title
 * @returns {Promise<Book>}
 */
async function fetchBookByTitle(title) {
    try {
        const [[book]] = await db.query("SELECT * FROM books WHERE title = ? ;", [title]);
        return new Book(book.title, book.background, book.border, book.image, book.preview_images, book.description, book.format, book.workbook_desc);
    } catch (error) {
        throw error;
    }
}

/**
 * This function returns the workbooks for the given book.
 * @param {Book} book
 * @returns {Promise<Array.<Workbook>> | Array.<>}
 */
async function handleWorkbooks(book) {
    return book.workbooks = book.workbook_desc ? await getWorkbooks(book.title) : [];
}

/**
 * Checks if a given title and format is valid.
 *
 * @param {string} title - The title of the product.
 * @param {string} format - The format of the product.
 *
 * @return {boolean} Returns true if both the title and format are valid, false otherwise.
 */
function isValidTitleAndType(title, format) {
    const validTitle = url_product_types.has(title.toLowerCase());
    const validFormat = url_product_types.has(format.toLowerCase());
    return validTitle && validFormat;
}