const nodemailer = require('nodemailer');
const Error = require('./Error');

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
         */
        this._receivers = [];

        /**
         *
         * @returns {{from: ?{}, to: null, subject: null, text: null, html: null}}
         * @private
         */
        this._options = this.defaultOptions;
    }

    /**
     *
     * @returns {{from: ?{}, to: null, subject: null, text: null, html: null}}
     */
    defaultOptions() {
        return {
            from: this._config.mailerSender,
            to: null,
            subject: null,
            text: null,
            html: null
        };
    }

    /**
     * @returns {nodemailer}
     */
    get transporter() {
        return nodemailer.createTransport(this._config.mailerTransporter);
    }

    /**
     *
     * @param {(Array|string)} email
     * @returns {Mailer}
     */
    addReceivers(email) {
        this._receivers.push(typeof(email) === 'object' ? email.join() : email);
        return this;
    }

    /**
     *
     * @param {(Array|string)} email
     * @param {string} subject
     * @param {?string} [text]
     * @param {?string} [html]
     * @returns {Mailer}
     */
    message(email, subject, text = null, html = null) {
        this._options.to = typeof(email) === 'object' ? email.join() : email;
        this._options.subject = subject;
        this._options.text = text;
        this._options.html = html;
        return this;
    }

    /**
     *
     * @param {string} error
     * @param {{}} error
     * @callback sentResponse
     */

    /**
     *
     * @param {sentResponse} callback
     * @returns {Mailer}
     */
    send(callback) {
        let scope = this;
        let email = this._receivers.find((value) => {
            return value === scope._options.to;
        });

        if (!email) {
            this.addReceivers(this._options.to);
        }

        this._options.to = this._receivers.join();

        this.transporter.sendMail(this._options, (error, info) => {
            if (error) {
                new Error(error).warning('Cannot send message', 'Mailer', 'send');
            }

            callback.call(this, info, error);
            // console.log('Message %s sent: %s', info.messageId, info.response);
        });

        return this;
    }

    /**
     *
     * @param {boolean} [receiver]
     * @param {boolean} [options]
     * @returns {Mailer}
     */
    clean(receiver = true, options = true) {
        if (receiver) {
            this._receivers = [];
        }
        if (options) {
            this._options = this.defaultOptions;
        }
        return this;
    }
}

/**
 *
 * @module Mailer
 */
module.exports = Mailer;
