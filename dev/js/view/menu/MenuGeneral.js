import ViewControls from '../../view/ViewControls';
import MenuGeneralBlock from './MenuGeneralBlock';

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

        /**
         *
         * @type {string}
         * @private
         */
        this._viewName = viewName;

        /**
         * This is options for menu
         *
         * @type {Array}
         * @private
         */
        this._options = [];

        // /**
        //  *
        //  * @type {*[]}
        //  */
        // this.viewOptions = [
        //     {
        //         name: 'TEST - 1',
        //         action: 'test_1',
        //         block: 'block_test_1',
        //         icon: 'fa-home',
        //         subItems: [
        //             {name: 'Test - 1', action: 'test-1'},
        //             {name: 'Test - 2', action: 'test-2'},
        //             {name: 'Test - 3', action: 'test-3'},
        //             {name: 'Test - 4', action: 'test-4'},
        //             {name: 'Close Menu', action: 'close'}
        //         ]
        //     },
        //     {
        //         name: 'Main Menu IronWar',
        //         action: MenuGeneral.ACTION_OPEN_MENU,
        //         block: MenuGeneral.BLOCK_MAIN_MENU,
        //         icon: null,
        //         subItems: [
        //             {name: 'Login', action: MenuGeneral.ACTION_LOGIN, lock: HIDE_IF_LOCKED},
        //             {name: 'Registration', action: MenuGeneral.ACTION_REGISTRATION, lock: HIDE_IF_LOCKED},
        //             {name: 'Logout', action: MenuGeneral.ACTION_LOGOUT, lock: SHOW_IF_LOCKED},
        //             {name: 'Settings', action: MenuGeneral.ACTION_SETTINGS, lock: SHOW_IF_LOCKED},
        //             {name: 'Close Menu', action: MenuGeneral.ACTION_CLOSE_MENU}
        //         ]
        //     }
        // ];

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
         * This is collection of listener for block.
         * Script call it before open any block
         *
         * @type {Array}
         * @private
         */
        this._eventsBeforeOpen = [];

        /**
         * It is name active action and block
         *
         * @type {{action: ?string, block: ?string}}
         * @private
         */
        this.active = {action: null, block: null};

        this.app.lock.addEventChangeStatus((status) => {
            this.rebuildMenu();
            this.lockControls(status);
        });
    }

    /**
     * Create block menu
     *
     * @param {string} name - This is name block
     * @returns {MenuGeneralBlock}
     */
    addBlock(name) {
        let block = new MenuGeneralBlock(name);
        this._options.push(block);
        return block;
    }

    /**
     * Sort only blocks menu
     *
     * @param {string} [type] - 'ASC' | 'DESC'
     * @returns {MenuGeneral}
     */
    sortBlocks(type = 'ASC') {
        this._options.sort(function(a, b) {
            return type === 'ASC' ? a['order'] - b['order'] : b['order'] - a['order'];
        });
        return this;
    }

    /**
     * Sort blocks menu and items
     *
     * @param {string} [typeSortBlocks] - 'ASC' | 'DESC'
     * @param {string} [typeSortItems] - 'ASC' | 'DESC'
     * @returns {MenuGeneral}
     */
    sortFull(typeSortBlocks = 'ASC', typeSortItems = 'ASC') {
        this.sortBlocks(typeSortBlocks);
        for (let block of this._options) {
            block.sortItems(typeSortItems);
        }
        return this;
    }

    /**
     * Build Menu
     *
     * @returns {MenuGeneral}
     */
    buildMenu() {
        this.viewOptions = this._options;
        this.build(this._viewName);
        this.showView(false);
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
        this.removeView();
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
                    status ? action.showElement() : action.remove();
                }

                if (lock === HIDE_IF_LOCKED) {
                    status ? action.remove() : action.showElement();
                }
            }
        }
        return this;
    }

    /**
     * It is event before block opening
     *
     * @callback eventsBeforeBlockOpen
     */

    /**
     * Add listener before open any block
     * Script call it before open any block
     *
     * @param {eventsBeforeBlockOpen} listener
     * @returns {MenuGeneral}
     */
    addEventBeforeOpen(listener) {
        this._eventsBeforeOpen.push(listener);
        return this;
    }

    /**
     * Initialisation events of menu.
     * You need call this method after upload menu
     *
     * @returns {MenuGeneral}
     */
    initEvents() {
        for (let block of this.viewOptions) {
            let blockName = block['block'];
            let actionName = block['action'];
            this._addEventToAction(block['action'], () => {
                let events = block['events'];
                for (let event of events) {
                    event(blockName);
                }
                this.toggle(actionName, blockName);
            });

            for (let item of block['subItems']) {
                let itemActionName = item['action'];
                this.getViewAction(itemActionName).addEvent('mouseover', () => {
                    this.app.sound.play(MENU_HOVER_MP3);
                });

                this._addEventToAction(itemActionName, () => {
                    this.toggle(actionName, blockName);

                    let events = item['events'];
                    for (let event of events) {
                        event(blockName, itemActionName);
                    }
                });
            }
        }
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
     * @param {string} actionName
     * @param {string} blockName - It is name of block
     * @returns {MenuGeneral}
     */
    showBlock(actionName, blockName) {
        this.status[blockName] = true;
        for (let listener of this._eventsBeforeOpen) {
            listener();
        }
        this.getViewBlock(blockName).showElement(true);
        this.getViewAction(actionName).hideElement();
        return this;
    }

    /**
     * Hide block
     * You need call this method after upload menu
     *
     * @param {string} actionName
     * @param {string} blockName - It is name of block
     * @returns {MenuGeneral}
     */
    hideBlock(actionName, blockName) {
        this.status[blockName] = false;
        this.getViewBlock(blockName).hideElement(true);
        this.getViewAction(actionName).showElement();
        return this;
    }

    /**
     * Open or close block menu
     * You need call this method after upload menu
     *
     * @param {string} actionName
     * @param {string} blockName It is name of block
     * @returns {MenuGeneral}
     */
    toggle(actionName, blockName) {

        if (this.status[blockName]) {
            // this.app.sound.play(MENU_CLOSE_MP3);
            this.app.sound.play(MENU_OPEN_MP3);
            this.hideBlock(actionName, blockName);
        } else {
            // If other block has already opened then closed it
            if (this.active['action'] && this.active['block']) {
                this.hideBlock(this.active['action'], this.active['block'])
            }

            this.app.sound.play(MENU_OPEN_MP3);
            this.showBlock(actionName, blockName);
            this.active['action'] = actionName;
            this.active['block'] = blockName;
        }
        return this;
    }
}

export default MenuGeneral;