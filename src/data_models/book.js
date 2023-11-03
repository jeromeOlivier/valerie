/**
 * @class
 */
class Book {
    /**
     * @param {string} title
     * @param {string} background
     * @param {string} border
     * @param {string} image
     * @param {string} description
     * @param {string || null } workbook_desc
     */
    constructor(title, background, border, image, description, workbook_desc = null) {
        this.title = title;
        this.background = background;
        this.border = border;
        this.image = image;
        this.description = description;
        this.workbook_desc = workbook_desc;
    }
}

/**
 * @class
 */
class BookFormat {
    /**
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