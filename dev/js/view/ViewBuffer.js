/**
 * The EJS Templates
 *
 * @type {Object}
 */
const buffer = require('./../../../temp/ejs.json');

class ViewBuffer {

    /**
     * Find template in the buffer
     *
     * @param {string} viewName - Name of template
     * @returns {string} - template of EJS
     */
    static get(viewName) {
        return buffer[viewName];
    }
}

export default ViewBuffer;