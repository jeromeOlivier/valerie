const asyncHandler = require("express-async-handler");
const validPages = require("../utils/validPages");

// helper function to create handlers
function createHandler(handlerFunction) {
  return asyncHandler(async (req, res) => handlerFunction(req, res));
}

// handler for full page renders
function getLayout(req, res) {
  const request = req.url;
  const page = validPages.find((page) => page.path === request);
  if (page) {
    res.render("layout", { main: page.file });
  } else {
    res.render("layout", { main: "not_found" });
  }
}

// handler for data injected into layout using AJAX calls
function getData(req, res) {
  const request = req.url;
  const page = validPages.find((page) => page.path === request);
  if (page) {
    res.render(page.file);
  } else {
    res.render("not_found");
  }
}

// generate all the handlers based on validPages array
const routeHandlers = validPages.reduce((handlers, page) => {
  handlers[page.path] = page.full
    ? createHandler(getLayout)
    : createHandler(getData);
  return handlers;
}, {});

module.exports = {
  routeHandlers,
};

// path: src/handlers/get.js
