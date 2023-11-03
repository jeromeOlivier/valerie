const db = require("../db_ops/db");
const { NOT_FOUND, INVALID_QUERY } = require("../constants/messages");
const { getImages } = require("./getPages");

const getBookData = async(validUrl, validFormats) => {
    const [[book]] = await db.query("SELECT * FROM books WHERE title = ? ;", [validUrl.title]);
    db.disconnect;
    if (book.length === 0) throw new Error(NOT_FOUND);
    const title = book.title.toLowerCase();
    const format = "pdf";
    const book_format = await getBookFormat(title, format, validFormats);
    book.workbooks = book.workbook_desc ? await getWorkbooks(title) : [];
    const images = await getImages(book.title);
    return { book, book_format, images };
};

async function getBook(req, res, validUrls, validFormats) {
    if (req && typeof req.url === "string") {
        const validUrl = validUrls.find((s) => s.path === req.url);
        if (!validUrl || !validUrl.title) {
            return res.status(500).send(INVALID_QUERY);
        }
        try {
            const { book, book_format, images } = await getBookData(validUrl, validFormats);
            res.render(validUrl.full ? "layout" : "book", { main: "book", book, book_format, images });
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(500).send(INVALID_QUERY);
    }
}

async function getBookFormat(title, format, validFormats) {
    // validate the query parameters
    const isValidTitle = validFormats.has(title);
    const isValidFormat = validFormats.has(format);
    const capitalizedTitle = title[0].toUpperCase() + title.slice(1);
    if (!isValidTitle || !isValidFormat) throw new Error(INVALID_QUERY);

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
    if (!book_format) throw new Error(INVALID_QUERY);
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

module.exports = {
    getBook,
    getBookFormat,
    getWorkbooks,
};