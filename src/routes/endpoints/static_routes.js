/**
 * module for static book routes
 * @module routes/endpoints/static_routes
 */

const staticPage = require("../../controllers/static_controllers");
const staticRouter = require("express").Router();

staticRouter.get("", staticPage.render);
staticRouter.get("/contact", staticPage.render);
staticRouter.get("/service", staticPage.render);

staticRouter.get("/swap_index", staticPage.render);
staticRouter.get("/swap_contact", staticPage.render);
staticRouter.get("/swap_service", staticPage.render);

staticRouter.post("/message", staticPage.message);

module.exports = staticRouter;