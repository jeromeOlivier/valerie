/**
 * module for static book routes
 * @module routes/endpoints/static_routes
 */

const staticPage = require("../../controllers/static_controllers");
const staticRouter = require("express").Router();

staticRouter.get("", staticPage.renderPage);
staticRouter.get("/contact", staticPage.renderPage);
staticRouter.get("/service", staticPage.renderPage);

staticRouter.get("/swap_index", staticPage.renderPage);
staticRouter.get("/swap_contact", staticPage.renderPage);
staticRouter.get("/swap_service", staticPage.renderPage);

staticRouter.post("/processMessage", staticPage.processMessage);

module.exports = staticRouter;