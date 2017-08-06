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
}

export default Components;
