import nodeMailer from 'nodemailer';

class Mailer {
    /**
     *
     * @param {Conf} config
     */
    constructor(config) {

        /**
         *
         * @type {Conf}
         * @private
         */
        this._config = config;

        /**
         *
         * @type {Array}
         * @private
         */
        this._receivers = [];

        /**
         *
         * @type {{from: string, to: string, subject: string, text: string, html: string}}
         * @private
         */
        this._options = this.defaultOptions;
    }

    /**
     *
     * @returns {{from: string, to: string, subject: string, text: string, html: string}}
     */
    get defaultOptions() {
        return {from: this._config.mailer.sender, to: '', subject: '', text: '', html: ''};
    }

    /**
     * @returns {nodeMailer}
     */
    get transporter() {
        return nodeMailer.createTransport(this._config.mailer.transporter);
    }

    /**
     * Add receiver or many receivers
     *
     * @param {(Array|string)} email
     * @returns {Mailer}
     */
    addReceivers(email) {
        this._receivers.push(typeof(email) === 'object' ? email.join() : email);
        return this;
    }

    /**
     * Set text message. After this method please use method "send"
     *
     *
     * @param {string} text - Text message
     * @returns {Mailer}
     */
    message(text) {
        this._options.text = text;
        return this;
    }

    /**
     * Set HTML message. After this method please use method "send"
     *
     * @param {string} html - Html message
     * @returns {Mailer}
     */
    html(html) {
        this._options.html = html;
        return this;
    }

    /**
     * Response of sending
     *
     * @param {string} error
     * @param {Object} info
     * @callback awaitResponse
     */

    /**
     * Send data
     *
     * @param {(Array|string)} email - it is receiver or many receivers
     * @param {string} subject - Reason
     * @param {awaitResponse} [awaitResponse]
     * @returns {Mailer}
     */
    send(email, subject, awaitResponse) {
        this.addReceivers(email);
        this._options.subject = subject;
        this._options.to = this._receivers.join();
        this.transporter.sendMail(this._options, (error, info) => {
            if (awaitResponse) {
                awaitResponse(error, info);
            }
        });
        this._clean();
        return this;
    }

    /**
     * Clean data
     *
     * @returns {Mailer}
     * @private
     */
    _clean() {
        this._receivers = [];
        this._options = this.defaultOptions;
        return this;
    }
}

export default Mailer;
