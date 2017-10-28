import Application from '../../system/Application';

class IndicatorsItem {
    /**
     *
     * @param {string} icon
     */
    constructor(icon) {

        /**
         *
         * @type {Application}
         * @private
         */
        this._app = new Application();

        /**
         *
         * @type {string}
         * @private
         */
        this._icon = icon;

        /**
         * This is events of item indicator
         *
         * @type {Array}
         * @private
         */
        this._events = [];

        /**
         *
         * @type {number}
         * @private
         */
        this._order = 0;

        /**
         * ID of indicator
         *
         * @type {string|number}
         * @private
         */
        this._id = this._app.uuid;
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
     * Get events
     *
     * @returns {Array}
     */
    get events() {
        return this._events;
    }

    /**
     * Get order
     *
     * @returns {number}
     */
    get order() {
        return this._order;
    }

    /**
     * Get ID of indicator
     *
     * @returns {string|number}
     */
    get id() {
        return this._id;
    }

    /**
     * Set ID
     *
     * @param {string|number} id
     * @returns {IndicatorsItem}
     */
    setID(id) {
        this._id = id;
        return this;
    }

    /**
     * Set icon
     *
     * @param {string} icon
     * @returns {IndicatorsItem}
     */
    setIcon(icon) {
        this._icon = icon;
        return this;
    }

    /**
     * Set order
     *
     * @param {number} num
     * @returns {IndicatorsItem}
     */
    setOrder(num) {
        this._order = num;
        return this;
    }

    /**
     * Add listener to item
     *
     * @param {function} listener
     * @returns {IndicatorsItem}
     */
    addEvent(listener) {
        this._events.push(listener);
        return this;
    }
}

export default IndicatorsItem;