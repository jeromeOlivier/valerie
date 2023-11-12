/**
 * @class
 */
class Book {
    /**
     * A book.
     * @typedef {Object} Book
     * @param {string} title
     * @param {string} background
     * @param {string} border
     * @param {string} image
     * @param {Array<string>} preview_images
     * @param {string} description
     * @param {BookFormat} format
     * @param {string} [workbook_desc=""]
     * @param {Array<Workbook>} [workbooks]
     */
    constructor(title, background, border, image, preview_images, description, format, workbook_desc, workbooks) {
        this.title = title;
        this.background = background;
        this.border = border;
        this.image = image;
        this.preview_images = preview_images;
        this.description = description;
        this.format = format;
        this.workbook_desc = workbook_desc;
        this.workbooks = workbooks;
    }
}

/**
 * @class
 */
class BookFormat {
    /**
     * @constructor
     * @param {string} title
     * @param {Date} date
     * @param {string} type
     * @param {string} size
     * @param {number} pages
     * @param {string} language
     * @param {string} market
     * @param {number} price
     */
    constructor(title, date, type, size, pages, language, market, price) {
        this.title = title;
        this.date = date;
        this.type = type;
        this.size = size;
        this.pages = pages;
        this.language = language;
        this.market = market;
        this.price = price;
    }
}

/**
 * @class
 */
class Workbook {
  /**
   * @constructor
   * @param {string} title - Title of the workbook
   * @param {string} description - Description of the workbook
   */
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }
}

module.exports = { Book, BookFormat, Workbook };
// path: src/data_models/book.js