import ViewControls from '../../view/ViewControls';
import MenuGeneralBlock from './MenuGeneralBlock';

import {
    MENU_OPEN_MP3,
    MENU_HOVER_MP3
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
         * @type {Array.<MenuGeneralBlock>}
         * @private
         */
        this._options = [];

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
    }

    /**
     * Initialisation of menu
     *
     * @returns {MenuGeneral}
     */
    initialisationMenu() {
        this.app.lock.addEventChangeStatus((status) => {
            this.removeMenu();
            this.buildMenu(status);
        });
        return this;
    }

    /**
     * It is default status.
     * This constant is using to set lock status for block menu or item menu.
     * Look at method "MenuGeneralItem.setLockStatus | MenuGeneralBlock.setLockStatus | MenuGeneral.lockControls"
     *
     * @type {number}
     */
    static get SHOW_ANYWAY() {
        return 0;
    }

    /**
     * Show block or item if user is logged.
     * This constant is using to set lock status for block menu or item menu.
     * Look at method "MenuGeneralItem.setLockStatus | MenuGeneralBlock.setLockStatus | MenuGeneral.lockControls"
     *
     * @type {number}
     */
    static get SHOW_IF_LOCKED() {
        return 1;
    }

    /**
     * Hide block or item if user is logged.
     * This constant is using to set lock status for block menu or item menu.
     * Look at method "MenuGeneralItem.setLockStatus | MenuGeneralBlock.setLockStatus | MenuGeneral.lockControls"
     *
     * @type {number}
     */
    static get HIDE_IF_LOCKED() {
        return 2;
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
     * @param {boolean} status - It is status of user
     * @returns {MenuGeneral}
     */
    buildMenu(status = false) {
        this.lockControls(status);
        this.build(this._viewName);
        this.initEvents();
        this.showView(false);
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
     * @param {boolean} status
     * @returns {MenuGeneral}
     */
    lockControls(status) {
        let options = [];
        for (let block of this._options) {
            let newBlock,
                lock = block.lock;

            if (lock === MenuGeneral.SHOW_IF_LOCKED && status) {
                newBlock = Object.create(block);
            } else if (lock === MenuGeneral.HIDE_IF_LOCKED && status) {
                newBlock = Object.create(block);
            } else if (lock === MenuGeneral.SHOW_ANYWAY) {
                newBlock = Object.create(block);
            } else {
                continue;
            }

            let newItems = block['subItems'].filter((item) => {
                let lock = item['lock'];
                return (lock === MenuGeneral.SHOW_IF_LOCKED && status)
                    || (lock === MenuGeneral.HIDE_IF_LOCKED && !status)
                    || (lock === MenuGeneral.SHOW_ANYWAY);
            });

            if (newItems) {
                newBlock.setItems(newItems);
            }
            options.push(newBlock);
        }
        this.viewOptions = options;
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
                this.toggle(actionName, blockName);
                let events = block['events'];
                for (let event of events) {
                    event(blockName);
                }
            });

            if (block['active']) {
                this.toggle(actionName, blockName);
                let events = block['events'];
                for (let event of events) {
                    event(blockName);
                }
            }

            for (let item of block['subItems']) {
                let itemActionName = item['action'];
                this.getViewAction(itemActionName).addEvent('mouseover', () => {
                    this.app.sound.playMenu(MENU_HOVER_MP3);
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
        this.getViewAction(actionName).disable();
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
        this.getViewAction(actionName).enable();
        return this;
    }

    /**
     * Reset. Enable disabled items
     *
     * @returns {MenuGeneral}
     */
    reset() {
        this.status = {};
        for (let block of this._options) {
            this.getViewAction(block.action).enable();
        }
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
            this.app.sound.playMenu(MENU_OPEN_MP3);
            this.hideBlock(actionName, blockName);
        } else {
            // If other block has already opened then closed it
            if (this.active['action'] && this.active['block']) {
                this.hideBlock(this.active['action'], this.active['block'])
            }

            this.app.sound.playMenu(MENU_OPEN_MP3);
            this.showBlock(actionName, blockName);
            this.active['action'] = actionName;
            this.active['block'] = blockName;
        }
        return this;
    }
}

export default MenuGeneral;