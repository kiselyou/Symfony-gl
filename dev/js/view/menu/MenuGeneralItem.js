import Application from '../../system/Application';
import MenuGeneral from './MenuGeneral';

class MenuGeneralItem {
    constructor(name) {

        /**
         *
         * @type {Application}
         * @private
         */
        this._app = new Application();

        /**
         * This is item name
         *
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         *
         * @type {number}
         * @private
         */
        this._lock = MenuGeneral.SHOW_ANYWAY;

        /**
         * UUID of action
         *
         * @type {string|number}
         * @private
         */
        this._action = this._app.uuid;

        /**
         * This is events if item
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
        this._order = 1;
    }

    /**
     * This is item name
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * UUID of action
     *
     * @returns {string|number}
     */
    get action() {
        return this._action;
    }

    /**
     * Get lock status
     *
     * @returns {string|number}
     */
    get lock() {
        return this._lock;
    }

    /**
     * Get events of item
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
     * Set order
     *
     * @param {number} num
     * @returns {MenuGeneralItem}
     */
    setOrder(num) {
        this._order = num;
        return this;
    }

    /**
     * Set item name
     *
     * @param {string} name
     * @returns {MenuGeneralItem}
     */
    setName(name) {
        this._name = name;
        return this;
    }

    /**
     * Set lock status. (MenuGeneral.HIDE_IF_LOCKED | MenuGeneral.SHOW_IF_LOCKED | MenuGeneral.SHOW_ANYWAY)
     *
     * @param {number} status - This are constants of class "MenuGeneral"
     * @returns {MenuGeneralItem}
     */
    setLockStatus(status) {
        this._lock = status;
        return this;
    }

    /**
     * Set action id
     *
     * @param {string|number} id
     * @returns {MenuGeneralItem}
     */
    setActionID(id) {
        this._action = id;
        return this;
    }

    /**
     *
     * @param {function} listener
     * @returns {MenuGeneralItem}
     */
    addEvent(listener) {
        this._events.push(listener);
        return this;
    }
}

export default MenuGeneralItem;
