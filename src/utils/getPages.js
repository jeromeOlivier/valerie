const { INTERNAL_SERVER_ERROR, INVALID_QUERY } = require("../constants/messages");
const fs = require("fs");
const path = require("path");
const validUrls = require("../data_models/validUrls");

async function getPageLayout(req, res) {
    if (req && typeof req.url === "string") {
        // if req is defined and req.url is a string, try to render the page
        try {
            // validate the query parameters over the whitelist to prevent injection
            const isValid = validUrls.find(valid => valid.path === req.url);
            if (isValid) {
                // if the page is valid, render the layout with the page's content
                await res.render("layout", { main: isValid.file });
            } else {
                // if request is not valid, render the layout with the index content
                await res.render("layout", { main: "index" });
            }
        } catch (err) {
            // if error occurs during process, send a 500 status code
            res.status(500).send(INTERNAL_SERVER_ERROR);
        }
    } else {
        // if req is undefined or req.url is not a string, send 400 status code
        res.status(400).send(INVALID_QUERY);
    }
}

async function getPageData(req, res) {
    if (req && typeof req.url === "string") {
        try {
            // validate the query parameters over the whitelist to prevent injection
            const valid = validUrls.find((page) => page.path === req.url);
            if (valid) {
                // if the page is valid, render the layout with the page's content
                res.render(valid.file);
            } else {
                // if the page is not valid, render the layout with the index content
                res.render("not_found");
            }
        } catch (err) {
            // if error occurs during process, send a 500 status code
            res.status(500).send(INTERNAL_SERVER_ERROR);
        }
    } else {
        // if req is undefined or req.url is not a string, throw an error
        res.status(400).send(INVALID_QUERY);
    }
}

async function getBlogData(req, res) {
    if (req && typeof req.url === "string") {
        try {
            const valid = validUrls.find((page) => page.path === req.url);
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

const IMAGE_PATH = "img/webp";

async function getImages(title) {
    // generate the absolute path to the directory for the book's images
    const directoryPath = path.join(__dirname, `../public/${ IMAGE_PATH }/${ title }`);
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
}

module.exports = {
    getPageLayout,
    getPageData,
    getBlogData,
    getImages,
};