import ViewControls from '../../view/ViewControls';
/**
 * Show element if user is logged
 *
 * @type {number}
 */
const SHOW_IF_LOCKED = 1;
const HIDE_IF_LOCKED = 2;

import {
    MENU_OPEN_MP3,
    MENU_HOVER_MP3,
    MENU_CLOSE_MP3
} from './../../ini/sound-ini';

/**
 * @class {MenuGeneral}
 * @extends {View}
 */
class MenuGeneral extends ViewControls {
    /**
     *
     * @param {string} viewName - It is template name
     */
    constructor(viewName) {
        super();

        this._viewName = viewName;

        this.viewOptions = [
            {
                name: 'Main Menu IronWar',
                action: MenuGeneral.ACTION_OPEN_MENU,
                block: MenuGeneral.BLOCK_MAIN_MENU,
                subItems: [
                    {name: 'Login', action: MenuGeneral.ACTION_LOGIN, lock: HIDE_IF_LOCKED},
                    {name: 'Registration', action: MenuGeneral.ACTION_REGISTRATION, lock: HIDE_IF_LOCKED},
                    {name: 'Logout', action: MenuGeneral.ACTION_LOGOUT, lock: SHOW_IF_LOCKED},
                    {name: 'Settings', action: MenuGeneral.ACTION_SETTINGS, lock: SHOW_IF_LOCKED},
                    {name: 'Close Menu', action: MenuGeneral.ACTION_CLOSE_MENU}
                ]
            }
        ];

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

        /**
         * It is event before block opening
         *
         * @callback eventsBeforeBlockOpen
         */

        /**
         *
         * @type {Object.<Array.<eventsBeforeBlockOpen>>}
         * @private
         */
        this._eventsBeforeBlockOpen = {};

        /**
         * It is name active action
         *
         * @type {?string}
         * @private
         */
        this._activeAction = null;

        this.buildMenu();

        this.app.lock.addEventChangeStatus((status) => {
            this.rebuildMenu();
            this.lockControls(status);
        });
    }

    /**
     * Build Menu
     *
     * @returns {MenuGeneral}
     */
    buildMenu() {
        this.build(this._viewName);
        this.show(false);
        this.initEvents();
        return this;
    }

    /**
     * Rebuild menu
     *
     * @returns {MenuGeneral}
     */
    rebuildMenu() {
        this.removeMenu();
        this.buildMenu();
        return this;
    }

    /**
     * Remove menu
     *
     * @returns {void}
     */
    removeMenu() {
        this.status = {};
        this.removeElement();
    }

    /**
     *
     * @returns {MenuGeneral}
     */
    lockControls(status) {
        for (let item of this.viewOptions) {
            let subItems = item['subItems'];
            for (let subItem of subItems) {
                let lock = subItem['lock'];
                let action = this.getViewAction(subItem['action']);

                if (lock === SHOW_IF_LOCKED) {
                    status ? action.show() : action.remove();
                }

                if (lock === HIDE_IF_LOCKED) {
                    status ? action.remove() : action.show();
                }
            }
        }
        return this;
    }

    /**
     * Set listener before open block
     *
     * @param {string} blockName - Name of block
     * @param {eventsBeforeBlockOpen} listener
     * @returns {MenuGeneral}
     */
    addEventBeforeBlockOpen(blockName, listener) {
        if (!this._eventsBeforeBlockOpen.hasOwnProperty(blockName)) {
            this._eventsBeforeBlockOpen[blockName] = [];
        }

        this._eventsBeforeBlockOpen[blockName].push(listener);
        return this;
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
                this._activeAction = option['action'];
                this.toggle(blockName);
            });

            for (let item of option['subItems']) {
                let itemActionName = item['action'];
                this.getViewAction(itemActionName).addEvent('mouseover', () => {
                    this.app.sound.play(MENU_HOVER_MP3);
                });

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
    static get ACTION_CLOSE_MENU() {
        return 'main-menu-close';
    }

    /**
     * It is name of event "Open block of menu"
     *
     * @returns {string}
     * @constructor
     */
    static get ACTION_OPEN_MENU() {
        return 'main-menu-open';
    }

    /**
     * It is name of event "Open block of menu"
     *
     * @returns {string}
     * @constructor
     */
    static get BLOCK_MAIN_MENU() {
        return 'main-menu';
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

    /**
     * Add event to action
     *
     * @param {string} name - It is name of action
     * @param listener
     * @returns {void}
     * @private
     */
    _addEventToAction(name, listener) {
        this.getViewAction(name).addEvent('click', listener);
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
     * Show block
     * You need call this method after upload menu
     *
     * @param {string} name - It is name of block
     * @returns {MenuGeneral}
     */
    showBlock(name) {
        this.status[name] = true;
        if (this._eventsBeforeBlockOpen.hasOwnProperty(name)) {
            for (let listener of this._eventsBeforeBlockOpen[name]) {
                listener();
            }
        }
        this.getViewBlock(name).show(true);
        this.getViewAction(this._activeAction).hide();
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
        this.getViewBlock(name).hide(true);
        this.getViewAction(this._activeAction).show();
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
        if (this.status[blockName]) {
            this.app.sound.play(MENU_CLOSE_MP3);
            this.hideBlock(blockName)
        } else {
            this.app.sound.play(MENU_OPEN_MP3);
            this.showBlock(blockName)
        }
        return this;
    }
}

export default MenuGeneral;