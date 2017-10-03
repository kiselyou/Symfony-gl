import Application from '../../system/Application';

class TabItem {
    /**
     *
     * @param {string} name
     */
    constructor(name) {

        /**
         *
         * @type {Application}
         * @private
         */
        this._app = new Application();

        /**
         * Tab name
         *
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * Tab icon
         *
         * @type {?string}
         * @private
         */
        this._icon = null;

        /**
         * This is string inside a container
         *
         * @type {string|prepareContainer}
         * @private
         */
        this._content = '';

        /**
         * Status of content
         *
         * @type {boolean}
         * @private
         */
        this._statusContentEvent = false;

        /**
         * Active tab
         *
         * @type {boolean}
         * @private
         */
        this._active = false;

        /**
         * Close btn
         *
         * @type {boolean}
         * @private
         */
        this._close = false;

        /**
         * UUID
         *
         * @type {string|number}
         * @private
         */
        this._uuid = this._app.uuid;
    }

    /**
     *
     * @param {boolean} value
     * @returns {TabItem}
     */
    setCloseBtn(value = true) {
        this._close = value;
        return this;
    }

    /**
     *
     * @param {string} name
     * @returns {TabItem}
     */
    setName(name) {
        this._name = name;
        return this;
    }

    /**
     *
     * @param {string} icon
     * @returns {TabItem}
     */
    setIcon(icon) {
        this._icon = icon;
        return this;
    }

    /**
     * @param {UIElement} container - This element of container
     * @callback prepareContainer
     */

    /**
     * By this method you can add a object or string data to the container under tab
     *
     * @param {string|prepareContainer} data - It is string data or listener
     * @returns {TabItem}
     */
    setContent(data) {
        this._content = data;
        return this;
    }

    /**
     *
     * @param {string|number} id
     * @returns {TabItem}
     */
    setID(id) {
        this._uuid = id;
        return this;
    }

    /**
     *
     * @param {boolean} active
     * @returns {TabItem}
     */
    setActive(active = true) {
        this._active = active;
        return this;
    }

    /**
     * Sets status of content.
     * true - content has already added
     * false - content has not already added
     *
     * @param {boolean} status
     */
    setStatusContentEvent(status) {
        this._statusContentEvent = status;
        return this;
    }

    /**
     *
     * @returns {boolean}
     */
    get statusContentEvent() {
        return this._statusContentEvent;
    }

    /**
     *
     * @returns {boolean}
     */
    get close() {
        return this._close;
    }

    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     *
     * @returns {string}
     */
    get icon() {
        return this._icon;
    }

    /**
     *
     * @returns {string}
     */
    get content() {
        return typeof this._content === 'function' ? '' : this._content;
    }

    /**
     *
     * @returns {?prepareContainer}
     */
    get contentEvent() {
        return typeof this._content === 'function' ? this._content : null;
    }

    /**
     *
     * @returns {string|number}
     */
    get uuid() {
        return this._uuid;
    }

    /**
     *
     * @returns {boolean}
     */
    get active() {
        return this._active;
    }
}

export default TabItem;