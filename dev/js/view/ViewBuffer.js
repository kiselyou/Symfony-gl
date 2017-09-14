/**
 * The EJS Templates
 *
 * @type {Object}
 */
const buffer = require('./../../../temp/ejs.json');

class ViewBuffer {

    constructor() {

        /**
         * @type {Object}
         */
        this._buffer = buffer;
    }

    /**
     * Find template in the buffer
     *
     * @param {string} viewName - Name of template
     * @returns {string} - template of EJS
     */
    findInBuffer(viewName) {
        return this._buffer[viewName];
    }
}

export default ViewBuffer;