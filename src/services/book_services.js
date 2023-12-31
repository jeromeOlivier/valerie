/**
 * book services module
 * @module services/book_services
 */

module.exports = { getBook, getBookFormat, getBookPreviewImages };

const { INVALID_QUERY } = require("../constants/messages");
const { WEBP_IMAGE_PATH } = require("../constants/resources");
const { Book, Workbook, BookFormat, Configuration } = require("../data_models");
const { isValidQuery, findUrlEndpointConfiguration, isValidConfiguration, isValidTitleAndType } = require("./utility_services");
const db = require("../db_ops/db");
const fs = require("fs");
const path = require("node:path");

/**
 * This function returns the findBook data for the given configuration.
 * @param req
 * @param res
 * @returns {Promise<Book>, boolean}
 */
async function getBook(req, res) {
    if (!isValidQuery(req)) {
        res.status(500).send(INVALID_QUERY);
        return;
    }
    const configuration = findUrlEndpointConfiguration(req);
    console.log('getBook configuration', configuration);
    if (!isValidConfiguration(configuration)) {
        res.status(500).send(INVALID_QUERY);
        return;
    }
    try {
        const book = await getBookData(configuration);
        return { book, full: configuration.full };
    } catch (error) {
        console.log('getBook error', error);
        res.status(500).send(error.message);
    }
}

/**
 * This function returns the findBook data for the given configuration.
 * @param {Configuration} configuration
 * @returns {Promise<Book>}
 */
const getBookData = async(configuration) => {
    const book = await getBookByTitle(configuration.title);
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
    // get the findBook format data
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
    // get the workbooks for the findBook
    const [query] = await db.query(`
        SELECT wb.title       AS title,
               wb.description AS description,
               wb.seq_order   AS sequence,
               wbc.content    AS content,
               wbc.path       AS path,
               wbc.level      AS level
        FROM books b
                 JOIN workbooks wb ON wb.book_id = b.id
                 JOIN workbook_contents wbc ON wb.id = wbc.workbook_id
        WHERE b.title = ?
        ORDER BY b.id, sequence, path + '.';`, [title]);

    // If no workbooks returned for the findBook, handle accordingly
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
                description: currentWorkbook.description,
                contents: [],
            };
            // and push it to the accumulator
            accumulator.push(obj);
        }

        // push the description to the content array of the found (or just created) object
        obj.contents.push({
            content: currentWorkbook.content,
            level: currentWorkbook.level,
        });

        return accumulator;
    }, []);
}

/**
 * This function returns an array of image paths for the given title.
 * @param title
 * @returns {Promise<Array.<string>>}
 */
async function getBookPreviewImages(title) {
    // generate the absolute path to the directory for the findBook's images
    const directoryPath = path.join(__dirname, `../public/${ WEBP_IMAGE_PATH }/${ title }`);

    return new Promise((resolve, reject) => {
        // read the directory
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(`Unable to read the directory for book images: ${ err }`);
            } else {
                // filter out non-webp files
                files = files.filter((file) => (file.endsWith(".webp")));
                // generate the relative configuration for each image
                const images = files.map((file) => `/${ WEBP_IMAGE_PATH }/${ title }/${ file }`);
                // if no images found, send back an empty array
                if (images.length === 0) {
                    resolve([]);
                }
                resolve(images);
            }
        });
    });
}

/**
 * This function returns the findBook data for the given title.
 * @param {string} title
 * @returns {Promise<Book>}
 */
async function getBookByTitle(title) {
    try {
        const [[book]] = await db.query("SELECT * FROM books WHERE title = ? ;", [title]);
        return new Book(book.title, book.background, book.border, book.image, book.preview_images, book.description, book.format, book.workbook_desc);
    } catch (error) {
        throw error;
    }
}

/**
 * This function returns the workbooks for the given findBook.
 * @param {Book} book
 * @returns {Promise<Array.<Workbook>> | Array.<>}
 */
async function handleWorkbooks(book) {
    return book.workbooks = book.workbook_desc ? await getWorkbooks(book.title) : [];
}
