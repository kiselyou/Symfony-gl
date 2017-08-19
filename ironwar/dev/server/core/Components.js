import Conf from './Conf';
import Session from './security/Session';
import Security from './security/Security';
import Authorization from './security/Authorization';
import uuidv4 from 'uuid/v4';
import qs from 'qs';

class Components {
    /**
     * Possible values it are constants of class "Conf"
     *
     * @param {string} env (Conf.ENV_DEV|Conf.ENV_PROD)
     */
    constructor(env) {

        this._req = {};
        this._res = {};

        /**
         *
         * @type {Conf}
         * @private
         */
        this._conf = new Conf(env);

        /**
         * @type qs
         */
        this.qs = qs;

        /**
         *
         * @type {Security}
         */
        this._security = new Security(this._conf);

        /**
         *
         * @type {Session}
         */
        this._session = new Session();

        /**
         *
         * @type {Authorization}
         */
        this._auth = new Authorization(this.session);

        /**
         *
         * @type {v4}
         */
        this.uuid = uuidv4;
    }

    /**
     * Security
     *
     * @returns {Security}
     */
    get security() {
        return this._security;
    }

    /**
     *
     * @returns {Authorization}
     */
    get authorization() {
        return this._auth;
    }

    /**
     *
     * @returns {Session}
     */
    get session() {
        return this._session;
    }

    /**
     *
     * @returns {Request}
     */
    get request() {
        return this._req;
    }

    /**
     *
     * @returns {*}
     */
    get response() {
        return this._res;
    }

    /**
     *
     * @param {Request} req
     * @returns {void}
     */
    set request(req) {
        this._req = req;
        this._session.update(this._req.session);
    }

    /**
     *
     * @param {*} res
     * @returns {void}
     */
    set response(res) {
        this._res = res;
    }

    /**
     *
     * @returns {Conf}
     */
    get config() {
        return this._conf;
    }

    /**
     * Get POST data
     *
     * @returns {Object}
     */
    get POST() {
        return this._req.body;
    }

    /**
     * Get GET data
     *
     * @returns {{}}
     */
    get GET() {
        let data = {};
        for (let key in this._req.params) {
            if (this._req.params.hasOwnProperty(key)) {
                data[key] = this._req.params[key];
            }
        }
        for (let key in this._req.query) {
            if (this._req.query.hasOwnProperty(key)) {
                data[key] = this._req.query[key];
            }
        }
        return data;
    }

    /**
     *
     * @param {string} data
     * @returns {Object|Array}
     */
    parseData(data) {
        return this.qs.parse(data);
    }
}

export default Components;
