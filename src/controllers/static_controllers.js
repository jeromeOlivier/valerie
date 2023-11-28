/**
 * static controllers module
 * @module controllers/static_controllers
 */

const { isValidQuery, findUrlEndpointConfiguration } = require("../services/utility_services");
const nodemailer = require("nodemailer");
const { Message } = require("../data_models/message");

/**
 * Render the appropriate view based on the request.
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {void}
 */
const renderPage = (req, res) => {
    try {
        if (isValidQuery(req)) {
            const page = findUrlEndpointConfiguration(req);
            if (page.full) {
                res.render("layout", { main: page.view });
            } else {
                res.render(page.view);
            }
        }
    } catch (error) {
        res.render("error_page", { message: error.message });
    }
};

/**
 * Sends an email using nodemailer, with the provided information.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const processMessage = (req, res) => {
    const message = new Message(req.body.from, req.body.subject, req.body.text);
    if (!message) {
        throw new Error("Missing required fields");
    }

    // send email using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ROBOT_SENDER,
            pass: process.env.ROBOT_PASSWORD.replace(/'+/g, ''),
        },
        priority: "high"
    });

    const mailOptions = {
        from: message.from,
        to: process.env.EMAIL_RECEIVER,
        subject: message.subject,
        text: `
        Courriel: ${message.from},
        Sujet: ${message.subject},
        Message: ${message.text}`,

    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error("Failed to send email:", error);
            res.status(500).render("error_page", { message: "Une erreur a eu lieu. Essayer à nouveau." });
        } else {
            res.render("thank_you_for_message");
        }
    });
};

module.exports = { renderPage, processMessage };
