import Conf from './Conf';
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
    }

    /**
     *
     * @returns {*}
     */
    getRequest() {
        return this._req;
    }

    /**
     *
     * @returns {*}
     */
    getResponse() {
        return this._res;
    }

    /**
     *
     * @param {string} data
     * @returns {Object|Array}
     */
    parseData(data) {
        return this.qs.parse(data);
    }

    /**
     * Get POST data
     *
     * @returns {{}}
     */
    getPostData() {
        return this._req.body;
    }

    /**
     * Get GET data
     *
     * @returns {{}}
     */
    getData() {
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
     * @returns {Conf}
     */
    get config() {
        return this._conf;
    }
}

export default Components;
