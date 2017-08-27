import View from '../../system/View';

import {
    ACTION_MAIN_MENU
} from '../view-actions.js';

/**
 * @class {MenuGeneral}
 * @extends {View}
 */
class MenuGeneral extends View {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super(path);

        this.viewOptions = [
            {
                name: 'Main Menu IronWar',
                action: ACTION_MAIN_MENU,
                block: MenuGeneral.BLOCK_MAIN_MENU,
                subItems: [
                    {name: 'Login', action: MenuGeneral.ACTION_LOGIN},
                    {name: 'Registration', action: MenuGeneral.ACTION_REGISTRATION},
                    {name: 'Logout', action: MenuGeneral.ACTION_LOGOUT},
                    {name: 'Settings', action: MenuGeneral.ACTION_SETTINGS},
                    {name: 'Close Menu', action: MenuGeneral.ACTION_CLOSE}
                ]
            }
        ];

        /**
         * It is blocks
         *
         * @type {Object.<UIElement>}
         */
        this.blocks = {};

        /**
         * It is actions
         *
         * @type {Object.<UIElement>}
         */
        this.actions = {};

        /**
         * It is status of block.
         * Key it is name of block.
         * Value means that block with the same name as key is opened or hidden
         *
         * @type {Object.<boolean>}
         *      e.g {actionName1: true, actionName2: false, ...}
         */
        this.status = {};

        /**
         *
         * @type {Object.<Object.<Array>>}
         */
        this._events = {};

        this.addItemEvent(MenuGeneral.BLOCK_MAIN_MENU, MenuGeneral.ACTION_CLOSE, (block, action) => {
            this.toggle(block);
        });
    }

    /**
     * Initialisation events of menu.
     * You need call this method after upload menu
     *
     * @returns {MenuGeneral}
     */
    initEvents() {
        for (let option of this.viewOptions) {
            let blockName = option['block'];
            this._addEventToAction(option['action'], () => {
                this.toggle(blockName);
            });

            for (let item of option['subItems']) {
                let itemActionName = item['action'];

                this._addEventToAction(itemActionName, () => {
                    this.toggle(blockName);
                    let block = this._events[blockName];
                    if (block && block[itemActionName]) {
                        let events = block[itemActionName];
                        for (let event of events) {
                            event(blockName, itemActionName);
                        }
                    }
                });
            }
        }
        return this;
    }

    /**
     * It is name of event "Login"
     *
     * @returns {string}
     * @constructor
     */
    static get ACTION_LOGIN() {
        return 'main-menu-login';
    }

    /**
     * It is name of event "Registration"
     *
     * @returns {string}
     * @constructor
     */
    static get ACTION_REGISTRATION() {
        return 'main-menu-registration';
    }

    /**
     * It is name of event "Logout"
     *
     * @returns {string}
     * @constructor
     */
    static get ACTION_LOGOUT() {
        return 'main-menu-logout';
    }

    /**
     * It is name of event "Settings"
     *
     * @returns {string}
     * @constructor
     */
    static get ACTION_SETTINGS() {
        return 'main-menu-settings';
    }

    /**
     * It is name of event "Close block of menu"
     *
     * @returns {string}
     * @constructor
     */
    static get ACTION_CLOSE() {
        return 'main-menu-close';
    }

    /**
     * It is name of event "Open block of menu"
     *
     * @returns {string}
     * @constructor
     */
    static get BLOCK_MAIN_MENU() {
        return ACTION_MAIN_MENU;
    }

    /**
     * @callback listenItemsMenu
     */

    /**
     * Add event for items of menu
     *
     * @param {string} block It is name of block
     * @param {string} action It is action name of item in block
     * @param {listenItemsMenu} listenItemsMenu
     * @returns {MenuGeneral}
     */
    addItemEvent(block, action, listenItemsMenu) {
        if (!this._events.hasOwnProperty(block)) {
            this._events[block] = {};
        }

        if (!this._events[block].hasOwnProperty(action)) {
            this._events[block][action] = [];
        }

        this._events[block][action].push(listenItemsMenu);
        return this;
    }

    _openBlock() {

    }

    _hideBlock() {

    }

    /**
     * Add event to action
     *
     * @param {string} name - It is name of action
     * @param listener
     * @returns {void}
     * @private
     */
    _addEventToAction(name, listener) {
        this.getAction(name).addEvent('click', listener);
    }

    /**
     * Get element of action by name
     * You need call this method after upload menu
     *
     * @param {string} name - It is name of action
     * @returns {UIElement}
     */
    getAction(name) {
        if (!this.actions[name]) {
            this.actions[name] = this.el.getElementByActionName(name);
        }
        return this.actions[name];
    }

    /**
     * Check if block menu is opened
     *
     * @param {string} name Name of block menu
     * @returns {boolean}
     */
    isOpenedBlock(name) {
        return this.status.hasOwnProperty(name) && this.status[name] === true;
    }

    /**
     * Get element block by name
     * You need call this method after upload menu
     *
     * @param {string} name - name of block
     * @returns {UIElement}
     */
    getBlock(name) {
        if (!this.blocks[name]) {
            this.blocks[name] = this.el.getElementByBlockName(name);
        }
        return this.blocks[name];
    }

    /**
     * Show block
     * You need call this method after upload menu
     *
     * @param {string} name - It is name of block
     * @returns {MenuGeneral}
     */
    showBlock(name) {
        this.status[name] = true;
        this.getBlock(name).show();
        return this;
    }

    /**
     * Hide block
     * You need call this method after upload menu
     *
     * @param {string} name - It is name of block
     * @returns {MenuGeneral}
     */
    hideBlock(name) {
        this.status[name] = false;
        this.getBlock(name).hide();
        return this;
    }

    /**
     * Open or close block menu
     * You need call this method after upload menu
     *
     * @param {string} blockName It is name of block
     * @returns {MenuGeneral}
     */
    toggle(blockName) {
        this.status[blockName] ? this.hideBlock(blockName) : this.showBlock(blockName);
        return this;
    }
}

export default MenuGeneral;