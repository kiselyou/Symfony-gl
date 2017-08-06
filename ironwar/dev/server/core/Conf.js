
class Conf {

    constructor() {
        /**
         * @type {{encoding: string, server: {port: number, host: string}, socket: {port: number, host: string}}}
         */
        this._conf = require('../config/config.json');

        /**
         * @type {{database: {host: string, port: number, user: string, password: string, database: string}}}
         */
        this.database = require('../config/database.json');

        /**
         * @type {{mailer: {sender: string, transporter: {host: string, port: number, secure: bool, auth: {user: string, pass: string}}}}}
         */
        this.mailer = require('../config/mailer.json');

        /**
         * @type {{security: {access_control: [{path: ''}, {path: "/home", role: "ROLE_IW_USER"}],role_hierarchy: {ROLE_ANONYMOUSLY: [], ROLE_IW: [ROLE_ANONYMOUSLY], ROLE_IW_USER: [ROLE_IW], ROLE_IW_ADMIN: [ROLE_IW_USER]}}}}
         */
        this.security = require('../config/security.json');
    }

    /**
     *
     * @returns {{port: number, host: string}}
     */
    get server() {
        return this._conf.server;
    }

    /**
     *
     * @returns {{port: number, host: string}}
     */
    get socket() {
        return this._conf.socket;
    }

    /**
     *
     * @returns {Array}
     */
    get accessControl() {
        return (this.security && this.security.hasOwnProperty('access_control')) ? this.security['access_control'] : [];
    }

    /**
     *
     * @returns {Object}
     */
    get roleHierarchy() {
        return (this.security && this.security.hasOwnProperty('role_hierarchy')) ? this.security['role_hierarchy'] : {};
    }
}

/**
 *
 * @module Conf
 */
export default Conf;

