
import MenuGeneralItem from './MenuGeneralItem';
import Application from '../../system/Application';

class MenuGeneralBlock {
    /**
     * This is block name
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
         * The icon name
         *
         * @type {string}
         * @private
         */
        this._icon = null;

        /**
         * This is block name. Can see when mouse over on action
         *
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * This is title inside a block
         *
         * @type {string}
         * @private
         */
        this._title = name;

        /**
         * UUID of block
         *
         * @type {string|number}
         * @private
         */
        this._block = this._app.uuid;

        /**
         * UUID of action
         *
         * @type {string|number}
         * @private
         */
        this._action = this._app.uuid;

        /**
         *
         * @type {number}
         */
        this._order = 1;

        /**
         * This are items inside block
         *
         * @type {Array.<MenuGeneralItem>}
         */
        this._subItems = [];

        /**
         * This is events of block
         *
         * @type {Array}
         * @private
         */
        this._events = [];
    }

    /**
     * The icon name
     *
     * @returns {string}
     */
    get icon() {
        return this._icon;
    }

    /**
     * Get block name. Can see when mouse over on action
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Get title inside a block
     *
     * @returns {string}
     */
    get title() {
        return this._title;
    }

    /**
     * Get UUID of action
     *
     * @returns {string|number}
     */
    get action() {
        return this._action;
    }

    /**
     * Get UUID of block
     *
     * @returns {string|number}
     */
    get block() {
        return this._block;
    }

    /**
     * Get list items inside block
     *
     * @returns {Array}
     */
    get subItems() {
        return this._subItems;
    }

    /**
     * Get list listeners of block
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
     * @returns {MenuGeneralBlock}
     */
    setOrder(num) {
       this._order = num;
       return this;
    }

    /**
     * Set icon name
     *
     * @param {string} name
     * @returns {MenuGeneralBlock}
     */
    setBlockIcon(name) {
        this._icon = name;
        return this;
    }

    /**
     * Set block name. Can see when mouse over on action
     *
     * @param {string} name
     * @returns {MenuGeneralBlock}
     */
    setBlockName(name) {
        this._name = name;
        return this;
    }

    /**
     * Set title. Can see inside a block
     *
     * @param {string} title
     * @returns {MenuGeneralBlock}
     */
    setBlockTitle(title) {
        this._title = title;
        return this;
    }

    /**
     * Set UUID of action
     *
     * @param {string|number} id
     * @returns {MenuGeneralBlock}
     */
    setBlockActionID(id) {
        this._action = id;
        return this;
    }

    /**
     * Set UUID of block
     *
     * @param {string|number} id
     * @returns {MenuGeneralBlock}
     */
    setBlockID(id) {
        this._block = id;
        return this;
    }

    /**
     *
     * @param {function} listener
     * @returns {MenuGeneralItem}
     */
    addBlockEvent(listener) {
        this._events.push(listener);
        return this;
    }

    /**
     * This are items inside block
     *
     * @param {string} name
     * @param {function} [listener]
     * @returns {MenuGeneralItem}
     */
    addItem(name, listener = null) {
        let item = new MenuGeneralItem(name);
        !listener || item.addEvent(listener);
        this._subItems.push(item);
        return item;
    }

    /**
     * Sore Items
     *
     * @param {string} [type] - 'ASC' | 'DESC'
     * @returns {MenuGeneralBlock}
     */
    sortItems(type = 'ASC') {
        this._subItems.sort(function(a, b) {
            return type === 'ASC' ? a['order'] - b['order'] : b['order'] - a['order'];
        });
        return this;
    }
}

export default MenuGeneralBlock;
