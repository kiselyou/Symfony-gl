
import View from '../../view/View';
import TabItem from './TabItem';
import Application from '../../system/Application';

import {
    MENU_CLOSE_MP3
} from './../../ini/sound-ini';

import {
    VIEW_NAME_TABS
} from './../../ini/ejs.ini';

const ACTIVE_TAB = 'tab__head_item_active';
const ACTIVE_BLOCK = 'tab__content_item_active';

class Tabs extends View {
    constructor() {
        super();

        /**
         * @type {string}
         */
        this._viewName = VIEW_NAME_TABS;

        /**
         *
         * @type {Array.<TabItem>}
         * @private
         */
        this._options = [];

        /**
         *
         * @type {Application}
         * @private
         */
        this._app = new Application();
    }

    /**
     * This method add setting to build tab.
     * The name is unique. If this tab has already added it will rewrite
     *
     * @param {string} name - The name of tab. WARNING: Is unique
     * @param {boolean} active - If set true the the tab will be active
     * @returns {TabItem}
     */
    addTab(name, active = false) {
        let newTab = null;
        for (let i = 0; i < this._options.length; i++) {
            /**
             * @type {TabItem}
             */
            let tab = this._options[i];
            // If current tab is active then set all other tabs are making not active
            if (active) {
                tab.setActive(false);
            }
            if (tab.name === name) {
                newTab = tab;
            }
        }

        if (!newTab) {
            newTab = new TabItem(name);
            this._options.push(newTab);
        }

        newTab.setActive(active);
        return newTab;
    }

    /**
     * Each times when you added tabs after it you need build it.
     *
     * @returns {Tabs}
     */
    buildTabs() {
        if (this._options.length === 0) {
            this._app.msg.alert('You must add at least one tab\'s item');
            return this;
        }

        this.viewOptions = this._options;
        this.autoCleanElement(true);
        super.build(this._viewName);
        this._addEventToAction();
        return this;
    }

    /**
     * Get active tab
     *
     * @returns {UIElement}
     */
    getActiveTab() {
        return this.getView().findOne('.' + ACTIVE_TAB);
    }

    /**
     * Get active block
     *
     * @returns {UIElement}
     */
    getActiveBlock() {
        return this.getView().findOne('.' + ACTIVE_BLOCK);
    }

    /**
     * Toggle tabs
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {Tabs}
     */
    toggleTab(key) {
        let activeTab = this.getActiveTab();
        activeTab.toggleClass(ACTIVE_TAB);
        let tab = this.getViewAction(key);
        tab.toggleClass(ACTIVE_TAB);
        this._toggleContent(key);
        return this;
    }

    /**
     * Find nearest tab
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {?{tab: UIElement, content: UIElement, key: (string|number)}}
     */
    findNearestTab(key) {
        return this.findNextTab(key) || this.findPreviousTab(key);
    }

    /**
     * Find previous tab
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {?{tab: UIElement, content: UIElement, key: (string|number)}}
     */
    findPreviousTab(key) {
        let number = this.getNumberTab(key);
        for (let i = (number - 1); i >= 0; i--) {
            let item = this._options[i];
            let uuid = item['uuid'];
            let tab = this.getViewAction(uuid);
            if (tab) {
                return {
                    tab: tab,
                    key: uuid,
                    content: this.getViewBlock(uuid),
                };
            }
        }
        return null;
    }

    /**
     * Serial number of tab
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {number}
     */
    getNumberTab(key) {
        for (let i = 0; i < this._options.length; i++) {
            let item = this._options[i];
            if (item['uuid'] === key) {
                return i;
            }
        }
        return 0;
    }

    /**
     * Find next tab
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {?{tab: UIElement, content: UIElement, key: (string|number)}}
     */
    findNextTab(key) {
        let number = this.getNumberTab(key);
        for (let i = (number + 1); i < this._options.length; i++) {
            let item = this._options[i];
            let uuid = item['uuid'];
            let tab = this.getViewAction(uuid);
            if (tab) {
                return {
                    tab: tab,
                    content: this.getViewBlock(uuid),
                    key: uuid
                };
            }
        }
        return null;
    }

    /**
     * Close tab. This method remove tab and content from the page
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {Tabs}
     */
    closeTab(key) {
        this
            .removeViewAction(key)
            .removeViewBlock(key);
        if (this._options.length > 0 && !this.getActiveTab()) {
            this.activeNearestTab(key);
        }
        this.removeTab(key);
        this._app.sound.play(MENU_CLOSE_MP3);
        return this;
    }

    /**
     *
     * @returns {Tabs}
     */
    clearTabs() {
        for (let item of this._options) {
            this.closeTab(item['uuid']);
        }
        return this;
    }

    /**
     * This method remove tab from the options.
     * If you need remove tab from the page. Please use method "closeTab"
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {Tabs}
     */
    removeTab(key) {
        for (let i = 0; i < this._options.length; i++) {
            let item = this._options[i];
            if (item['uuid'] === key) {
                this._options.splice(i, 1);
                break;
            }
        }
        return this;
    }

    /**
     * Set active nearest tab
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {Tabs}
     */
    activeNearestTab(key) {
        let nearestTab = this.findNearestTab(key);
        if (nearestTab) {
            nearestTab['tab'].addClass(ACTIVE_TAB);
            nearestTab['content'].addClass(ACTIVE_BLOCK);
        } else {
            this.hideView();
        }
        return this;
    }

    /**
     * Toggle content on the page
     *
     * @param {string|number} key - This is unique key of tab
     * @returns {Tabs}
     * @private
     */
    _toggleContent(key) {
        let activeBlock = this.getActiveBlock();
        activeBlock
            .hideElement()
            .toggleClass(ACTIVE_BLOCK);

        let block = this.getViewBlock(key);
        block
            .showElement()
            .toggleClass(ACTIVE_BLOCK);
        return this;
    }

    /**
     * Add events to tabs
     *
     * @returns {void}
     * @private
     */
    _addEventToAction() {
        for (let i = 0; i < this._options.length; i++) {
            let key = this._options[i]['uuid'];

            let item = this.getViewAction(key);

            item.addEvent('click', () => {
                this.toggleTab(key);
            });

            let itemClose = item.getElementByActionName(key);
            itemClose.addEvent('click', (e) => {
                e.cancelBubble = true;
                this.closeTab(key);
            });
        }
    }
}

export default Tabs;