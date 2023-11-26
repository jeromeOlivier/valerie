/**
 * module for blog routes
 * @module routes/endpoints/blog_routes
 */

const blog = require("../../controllers/blog_controllers");
const blogRouter = require("express").Router();

blogRouter.get("/blog", blog.blog);
blogRouter.get("/swap_blog", blog.swap_blog);

module.exports = blogRouter;