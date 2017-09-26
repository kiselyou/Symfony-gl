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
         * Content
         *
         * @type {string}
         * @private
         */
        this._content = '';

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
     * This is content of tab
     *
     * @param {string} data - It is string data
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
        this._active = Boolean(active);
        return this;
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
        return this._content;
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