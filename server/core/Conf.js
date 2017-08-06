/**
 * @type {{}}
 */
const config = require('../../server/config/config.json');

/**
 *
 * @type {string}
 */
const DIR_DEV = '/app';

/**
 *
 * @type {string}
 */
const DIR_PROD = '/dist';

/**
 *
 * @type {string}
 */
const ENVIRONMENT_PROD = 'prod';

class Conf {

    constructor() {
        /**
         * @type {{}}
         */
        this.conf = require('./../..' + this.pathConfig);
    }

    /**
     *
     * @returns {[]}
     */
    get accessControl() {
        return this.security && this.security.hasOwnProperty('access_control') ? this.security['access_control'] : [];
    }

    /**
     *
     * @returns {?{}}
     */
    get roleHierarchy() {
        return this.security && this.security.hasOwnProperty('role_hierarchy') ? this.security['role_hierarchy'] : null;
    }

    /**
     *
     * @returns {?{}}
     */
    get authorization() {
        return this._readConfig('authorization');
    }

    /**
     *
     * @returns {?{}}
     */
    get security() {
        return this._readConfig('security');
    }

    /**
     *
     * @returns {?{}}
     */
    get server() {
        return this._readConfig('server');
    }

    /**
     *
     * @returns {?{}}
     */
    get socket() {
        return this._readConfig('socket');
    }

    /**
     *
     * @returns {?{}}
     */
    get mailer() {
        return this._readConfig('mailer');
    }

    /**
     *
     * @returns {?{}}
     */
    get mailerTransporter() {
        return this.mailer && this.mailer.hasOwnProperty('transporter') ? this.mailer['transporter'] : null;
    }

    /**
     *
     * @returns {?{}}
     */
    get mailerSender() {
        return this.mailer && this.mailer.hasOwnProperty('sender') ? this.mailer['sender'] : null;
    }

    /**
     *
     * @returns {?{}}
     */
    get mySQL() {
        let db = this._readConfig('db');
        return db.hasOwnProperty('mysql') ? db['mysql'] : null;
    }

    /**
     *
     * @returns {?|{}}
     */
    get environment() {
        return config.hasOwnProperty('environment') ? config['environment'] : null;
    }

    /**
     *
     * @returns {string}
     */
    get encoding() {
        return config.hasOwnProperty('encoding') ? config['encoding'] : 'utf-8';
    }

    /**
     *
     * @returns {string}
     */
    get pathTemplates() {
        return this.pathEnvironment + '/view';
    }

    /**
     *
     * @returns {string}
     */
    get pathRoutes() {
        return '/server/routing';
    }

    /**
     *
     * @returns {string}
     */
    get pathController() {
        return '/server/controller';
    }

    /**
     * Get directory of environment
     *
     * @returns {string}
     */
    get pathEnvironment() {
        return this.environment.hasOwnProperty(ENVIRONMENT_PROD) && this.environment[ENVIRONMENT_PROD] ? DIR_PROD : DIR_DEV;
    }

    /**
     *
     * @returns {*}
     */
    get pathConfig() {
        if (this.isProd()) {
            return '/server/config/prod.json';
        }
        return '/server/config/dev.json';
    }

    /**
     *
     * @param {number} [type] 1 - text/html, 2 - application/json
     * @returns {{}}
     */
    contentType(type = 1) {
        let obj = {};
        switch (type) {
            case 2:
                obj = {'Content-Type': 'application/json'};
                break;
            case 1:
            default:
                obj = {'Content-Type': 'text/html'};
        }

        return obj;
    }

    /**
     *
     * @param {string} key
     * @param {?(string|number)} [value]
     * @returns {*}
     * @private
     */
    _readConfig(key, value = null) {
        return this.conf.hasOwnProperty(key) ? this.conf[key] : value;
    }

    /**
     *
     * @returns {boolean}
     */
    isDev() {
        return this.pathEnvironment !== DIR_PROD;
    };

    /**
     *
     * @returns {boolean}
     */
    isProd() {
        return this.pathEnvironment === DIR_PROD;
    };
}

/**
 *
 * @module Conf
 */
module.exports = Conf;

