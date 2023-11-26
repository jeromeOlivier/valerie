/**
 * Represents a configuration object with path, view, title, and full properties.
 * @class
 */
class Configuration {
    /**
     * @param {string} path
     * @param {string} view
     * @param {string} [title] - optional title
     * @param {boolean} full
     */
    constructor(path, view, title, full) {
        this.path = path;
        this.view = view;
        this.title = title;
        this.full = full;
    }
}

module.exports = Configuration;

// path: src/data_models/configuration.js