/**
 * static controllers module
 * @module controllers/static_controllers
 */

const { isValidQuery, findUrlEndpointConfiguration } = require("../services/utility_services");
const nodemailer = require("nodemailer");

/**
 * Render the appropriate view based on the request.
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {void}
 */
const render = (req, res) => {
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

const message = (req, res) => {
    const from = req.body.from;
    const subject = req.body.subject;
    const text = req.body.text;

    // send email using nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SMTP,
        port: process.env.MAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: from,
        to: process.env.EMAIL,
        subject: subject,
        text: text,
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

module.exports = { render, message };
