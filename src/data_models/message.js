/**
 * Class representing a message.
 * @class Message
 */
class Message {
    /**
     * Constructor for creating a new instance of a message.
     *
     * @param {string} from - The author's email.
     * @param {string} [subject] - The subject (optional).
     * @param {string} text - The content of the message.
     * @constructor
     */
    constructor(from, subject, text) {
        this.from = from;
        this.subject = subject;
        this.text = text;
    }
}

module.exports = { Message }