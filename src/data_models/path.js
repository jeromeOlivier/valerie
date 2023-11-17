/**
 * @class
 */
class Path {
    /**
     * @param {string} path
     * @param {string} file
     * @param {string} [title] - optional title
     * @param {boolean} full
     */
    constructor(path, file, title, full) {
        this.path = path;
        this.file = file;
        this.title = title;
        this.full = full;
    }
}

module.exports = Path;

// path: src/data_models/path.js