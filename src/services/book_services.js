// Description: This file contains the functions for getting the book data.
// constants
const { NOT_FOUND, INVALID_QUERY } = require("../constants/messages");
const { IMAGE_PATH } = require("../constants/links");
const db = require("../db_ops/db");

const {
    url_endpoint_config,
    url_product_types,
    Book,
    Workbook,
    BookFormat,
    Path,
    Cart,
    CartItem,
} = require("../data_models");

const { getQuantityOfItem } = require("./cart_services");
const { parseCartItemsFromCookie } = require("./cookie_services");
const { isValidQuery, fetchUrlEndpointConfiguration, isValidPath } = require("./utility_services");

const fs = require("fs");
const path = require("path");

/**
 * Description: This function returns the book data for the given path.
 * @param req
 * @param res
 * @returns {Promise<Book>, Path}
 */
async function getBook(req, res) {
    // validate the query parameters
    if (isValidQuery(req)) {
        // find the path in the urlEndpointConfig array, assign the matching values to path variable
        /**
         * @type {Path}
         */
        const path = fetchUrlEndpointConfiguration(req);
        // if path is null, send an error message
        if (!isValidPath(path)) { return res.status(500).send(INVALID_QUERY); }
        // get book data (book, book_format and preview images)
        try {
            /**
             * @type {Book}
             */
            const book = await getBookData(path);
            return { book, path };
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(500).send(INVALID_QUERY);
    }
}

/**
 * Description: This function returns the book data for the given path.
 * @param {Path} path
 * @returns {Promise<Book>}
 */
const getBookData = async(path) => {
    /**
     * @type {Book}
     */
    const book = await fetchBookByTitle(path.title);
    // get the book format data for the given title and pdf format
    book.format = await getBookFormat(book.title);
    // establish the quantity of books in user's cart
    // get the workbooks for the book if they exist
    await handleWorkbooks(book);
    // get the book cover image
    book.preview_images = await getBookPreviewImages(book.title);
    // return the book data
    return book;
};

/**
 * Description: This function returns relevant data for the given title and format.
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
        WHERE b.title = '${ title }'
          AND f.name = '${ format }';
    `);
    if (!query) throw new Error(INVALID_QUERY);
    // create a new BookFormat object
    return new BookFormat(query.title, query.date, query.type, query.size, query.pages, query.language, query.market, query.price);
}

/**
 * Description: This function returns the workbooks for the given title.
 * @param title
 * @returns {Promise<Array<Workbook>>}
 */
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

    // group the workbooks by title, add the description and level to the content array
    // and sort the content array by path
    return query.reduce((accumulator, current) => {
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
}

/**
 * Description: This function returns an array of image paths for the given title.
 * @param title
 * @returns {Promise<Array<Book.preview_images>>}
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
 * Description: This function returns the book data for the given title.
 * @param title
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
 * Description: This function checks if the book exists.
 * @param {Book} book
 * @return {Book}
 */
function isValidBook(book) {
    if (book && book.title) throw new Error(NOT_FOUND);
    return book;
}

/**
 * Description: This function returns the workbooks for the given book.
 * @param book
 * @returns {Promise<Array<Workbook>> | Array<>}
 */
async function handleWorkbooks(book) {
    return book.workbooks = book.workbook_desc ? await getWorkbooks(book.title) : [];
}

function isValidTitleAndType(title, format) {
    const validTitle = url_product_types.has(title.toLowerCase());
    const validFormat = url_product_types.has(format.toLowerCase());
    return validTitle && validFormat;
}

module.exports = {
    getBook,
    getBookFormat,
    isValidTitleAndType,
};