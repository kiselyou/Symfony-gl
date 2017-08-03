import Conf from './Conf';

class Components {
    constructor() {

        this._req = {};
        this._res = {};

        /**
         *
         * @type {Conf}
         * @private
         */
        this._conf = new Conf();
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
     * @returns {Conf}
     */
    get config() {
        return this._conf;
    }

    /**
     *
     * @param {string} [key]
     * @returns {{}}
     */
    getSession(key = '') {
        let session = this._req.session ? this._req.session : {};
        return key ? (session[key] ? session[key] : {}) : session;
    }

    /**
     *
     * @param {Object} data
     * @returns {Components}
     */
    setSession(data) {
        this._req.session = data;
        return this;
    }

    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns {Components}
     */
    addSessionData(key, value) {
        this._req.session[key] = value;
        return this;
    }

    /**
     *
     * @returns {Components}
     */
    destroySession() {
        this._req.session.destroy();
        return this;
    }
}

export default Components;
