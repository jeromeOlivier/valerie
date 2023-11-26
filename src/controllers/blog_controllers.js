/**
 * blog controllers module
 * @module controllers/blog_controllers
 */

const asyncHandler = require("express-async-handler");
const { getBlogData } = require("../services/blog_services");


const blog = asyncHandler(async(req, res) => {
    await res.render("layout", { main: "blog" });
});

const swap_blog = asyncHandler(async(req, res) => getBlogData(req, res));

module.exports = {
    blog,
    swap_blog,
};

