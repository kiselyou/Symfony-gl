import ejs from 'ejs';
import uuidv4 from 'uuid/v4';
import UIElement from './../system/ui/UIElement';

const bufferEJS = require('./../temp/bufferEJS.json');

class ViewBuffer {

    constructor() {

        /**
         *
         * @type {{}}
         * @private
         */
        this._viewParams = {};

        /**
         * @type {ejs}
         */
        this.ejs = ejs;

        /**
         * It is name of template
         *
         * @type {string}
         */
        this.name = uuidv4();

        /**
         * @type {Object}
         */
        this._buffer = bufferEJS;

        /**
         *
         * @type {UIElement}
         * @private
         */
        this._el = this._createElement();
    }

    /**
     * It is selector of main container
     *
     * @returns {string}
     * @constructor
     */
    static get MAIN_CONTAINER_ID() {
        return '#initialisation_main_elements';
    }

    /**
     * Create empty element which will have template
     *
     * @returns {UIElement}
     * @private
     */
    _createElement() {
        return new UIElement().hide().setNameElement(this.name);
    }

    /**
     *
     * @param {string} ejs
     * @returns {*}
     * @private
     */
    _renderEJS(ejs) {
        return this.ejs.render(ejs, this._viewParams);
    }

    /**
     * Find template
     *
     * @param {string} name - Name of template
     * @returns {UIElement|*}
     */
    find(name) {
        let html = this._renderEJS(this._buffer[name]);
        this._el.beforeEnd(html);
        return this._el;
    }
}

export default ViewBuffer;