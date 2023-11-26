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
}

const sendEmail = (req, res) => {
    // send email with node mailer

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_password'
        }
    });

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: 'recipient_email@gmail.com',
        subject: 'Subject of your email',
        text: 'Body of your email'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    // upon success, respond with page render
}

module.exports = { render, sendEmail };
