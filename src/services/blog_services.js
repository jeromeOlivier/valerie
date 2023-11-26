/**
 * blog_services module
 * @module services/blog_services
 */

module.exports = { getBlogData }

const { INVALID_QUERY, INTERNAL_SERVER_ERROR } = require("../constants/messages");
const { url_endpoint_config } = require("../data_models/url_endpoint_config");
const db = require("../db_ops/db");
const fs = require("fs");

/**
 * Retrieves blog data based on the request URL.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @return {Promise<void>} - A promise that resolves after rendering the appropriate blog data or error book.
 */
async function getBlogData(req, res) {
    if (req && typeof req.url === "string") {
        try {
            const valid = url_endpoint_config.find((page) => page.path === req.url);
            if (valid) {
                res.render(valid.file);
            } else {
                res.render("not_found");
            }
        } catch (err) {
            res.status(500).send(INTERNAL_SERVER_ERROR);
        }
    } else {
        res.status(400).send(INVALID_QUERY);
    }
}
