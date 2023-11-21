/**
 * @module router
 * @typedef {object} Router - Express router
 */
const router = require("express").Router();

/**
 * @namespace
 * @desc Page controllers module.
 */
const page = require("../controllers/page_controllers");
/**
 * @namespace
 * @desc Cart controllers module.
 */
const cart = require("../controllers/cart_controllers");

// GET CONTENT WITH LAYOUT (whole page)
/**
 * GET endpoint for the index page in a full page load
 */
router.get("/", page.index);
/**
 * GET endpoint for the blog page in a full page load
 */
router.get("/blog", page.blog);
/**
 * GET endpoint for the contact page in a full page load
 */
router.get("/contact", page.contact);
/**
 * GET endpoint for the blog service page in a full page load
 */
router.get("/service", page.service);
/**
 * GET endpoint for the book page using excel data in a full page load
 */
router.get("/excel", page.book);
/**
 * GET endpoint for the book page using outlook data in a full page load
 */
router.get("/outlook", page.book);
/**
 * GET endpoint for the book page using powerpoint data in a full page load
 */
router.get("/powerpoint", page.book);
/**
 * GET endpoint for the book page using word data in a full page load
 */
router.get("/word", page.book);

// GET CONTENT WITHOUT LAYOUT (partial page)

/**
 * GET endpoint for the index page in an htmx DOM swap
 */
router.get("/data_index", page.data_index);
/**
 * GET endpoint for the blog page in an htmx DOM swap
 */
router.get("/data_blog", page.data_blog);
/**
 * GET endpoint for the contact page in an htmx DOM swap
 */
router.get("/data_contact", page.data_contact);
/**
 * GET endpoint for the service page in an htmx DOM swap
 */
router.get("/data_service", page.data_service);
/**
 * GET endpoint for the excel page in an htmx DOM swap
 */
router.get("/data_excel", page.book);
/**
 * GET endpoint for the outlook page in an htmx DOM swap
 */
router.get("/data_outlook", page.book);
/**
 * GET endpoint for the powerpoint page in an htmx DOM swap
 */
router.get("/data_powerpoint", page.book);
/**
 * GET endpoint for the word page in an htmx DOM swap
 */
router.get("/data_word", page.book);

// ELEMENTS
/**
 * GET endpoint for the book type element in an htmx DOM swap
 */
router.get("/format/:title/:type", page.book_format);
/**
 * GET endpoint for the book preview element in an htmx DOM swap
 */
router.get("/preview/:title", page.preview);

// CART ENDPOINTS
/**
 * GET endpoint for the cart page in an htmx DOM swap
 */
router.get("/data_cart", cart.findAllCartItems)
/**
 * GET endpoint for the cart page in a full page load
 */
router.get("/cart/", cart.findAllCartItems);
/**
 * GET endpoint for the cart page in either a full page load or an htmx DOM swap
 */
router.get("/checkout", cart.initiateShoppingSession);
/**
 * POST endpoint to add an item to the cart
 */
router.post("/cart/add/:title/:type", cart.addItemToCart);
/**
 * DELETE endpoint to remove an item from the cart
 */
router.delete("/cart/delete/:title/:type", cart.removeItemFromCart);
/**
 * GET endpoint to initiate a checkout process
 */
router.get('/cart/checkout', cart.initiateShoppingSession);
/**
 * POST endpoint to send postcode and receive a shipping estimate in return
 */
router.post("/cart/shipping_estimate", cart.getShippingEstimate);

module.exports = router;
