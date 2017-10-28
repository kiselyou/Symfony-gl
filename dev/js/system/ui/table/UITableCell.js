import uuidv4 from 'uuid/v4';

class UITableCell {
    constructor() {

        /**
         * @type {string}
         */
        this._uuid = uuidv4();

        /**
         * This is string inside a cell
         *
         * @type {string}
         * @private
         */
        this._content = '';

        /**
         *
         * @type {number}
         * @private
         */
        this._width = 0;

        /**
         *
         * @type {Array.<prepareContainer>}
         */
        this._listener = [];
    }

    /**
     * @param {UIElement} container - This element of container
     * @callback prepareContainer
     */

    /**
     * By this method you can add string data to the cell
     *
     * @param {string} value - It is string data or listener
     * @returns {UITableCell}
     */
    setContent(value) {
        this._content = value;
        return this;
    }

    /**
     * By this method you can add a object data or set event to the cell
     *
     * @param {prepareContainer} listener
     */
    addContentEvent(listener) {
        this._listener.push(listener);
        return this;
    }

    /**
     * Set width to specific cell
     *
     * @param {number} value
     * @returns {UITableCell}
     */
    setWidth(value) {
        this._width = value;
        return this;
    }

    /**
     * Gets uuid of cell
     *
     * @returns {string}
     */
    get uuid() {
        return this._uuid;
    }

    /**
     * Gets string value for cell
     *
     * @returns {string}
     */
    get content() {
        return this._content;
    }

    /**
     * Gets listener of cell
     *
     * @returns {Array.<prepareContainer>}
     */
    get contentEvents() {
        return this._listener;
    }

    get width() {
        return this._width;
    }
}

export default UITableCell;