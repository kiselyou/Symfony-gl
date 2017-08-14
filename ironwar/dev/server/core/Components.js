import Conf from './Conf';

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
}

export default Components;
