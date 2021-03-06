import uuidv4 from 'uuid/v4';

class PanelFoldingItem {
    constructor() {
        /**
         *
         * @type {?string}
         * @private
         */
        this._icon = null;

        /**
         *
         * @type {string}
         * @private
         */
        this._title = '';

        /**
         * @type {string}
         * @private
         */
        this._uuid = uuidv4();

        /**
         *
         * @type {string}
         * @private
         */
        this._content = '';

        /**
         * Status of pane (opened|closed)
         *
         * @type {boolean}
         * @private
         */
        this._status = false;

        /**
         *
         * @type {string}
         * @private
         */
        this._margin = 'mg_xs';
    }

    /**
     * Gets icon name
     *
     * @returns {string}
     */
    static get ICON_OPEN() {
        return 'fa-window-maximize';

    }

    /**
     * Gets icon name
     *
     * @returns {string}
     */
    static get ICON_CLOSE() {
        return 'fa-window-minimize';
    }

    /**
     * Sets icon
     *
     * @param {string} value
     * @returns {PanelFoldingItem}
     */
    setIcon(value) {
        this._icon = value;
        return this;
    }

    /**
     * Gets icon action Opened|Closed
     *
     * @returns {string}
     */
    get iconSwitch() {
        return this._status ? PanelFoldingItem.ICON_CLOSE : PanelFoldingItem.ICON_OPEN;
    }

    /**
     * Gets icon
     *
     * @returns {string}
     */
    get icon() {
        return this._icon;
    }

    /**
     * Sets title
     *
     * @param {string} value
     * @returns {PanelFoldingItem}
     */
    setTitle(value) {
        this._title = value;
        return this;
    }

    /**
     * Gets title
     *
     * @returns {string}
     */
    get title() {
        return this._title;
    }

    /**
     * Sets status of panel
     *
     * @param {boolean} value - true is opened and false is closed
     * @returns {PanelFoldingItem}
     */
    open(value) {
        this._status = value;
        return this;
    }

    /**
     * Status of panel (opened|closed)
     *
     * @returns {boolean}
     */
    get isOpened() {
        return this._status;
    }

    /**
     * @param {UIElement} container - This element of container
     * @callback prepareContent
     */

    /**
     * Sets content
     *
     * @param {string|prepareContent} value
     * @returns {PanelFoldingItem}
     */
    setContent(value) {
        this._content = value;
        return this;
    }

    /**
     * Gets content
     *
     * @returns {string}
     */
    get content() {
        return typeof this._content === 'function' ? '' : this._content;
    }

    /**
     * Gets content event
     *
     * @returns {?prepareContainer}
     */
    get contentEvent() {
        return typeof this._content === 'function' ? this._content : null;
    }

    /**
     * Gets item ID
     *
     * @returns {string}
     */
    get uuid() {
        return this._uuid;
    }

    /**
     * Gets margin
     *
     * @returns {string}
     */
    get margin() {
        return this._margin;
    }
}

export default PanelFoldingItem;