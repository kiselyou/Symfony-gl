
import View from '../../view/View';
import Application from '../../system/Application';

import {VIEW_NAME_TABS} from './../../ini/ejs.ini';

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
         * @type {Array}
         * @private
         */
        this._options = [];

        /**
         *
         * @type {Array}
         * @private
         */
        this._removedItems = [];

        /**
         *
         * @type {Application}
         * @private
         */
        this._app = new Application();
    }

    /**
     *
     * @param {string} name
     * @param {?string} [content]
     * @param {?string} [icon]
     * @param {boolean} [active]
     * @returns {Tabs}
     */
    addItem(name, content = '', icon = '', active = false) {
        let item = this._options.find((el) => {
            return el['name'] === name;
        });
        if (!item) {
            this._options.push(
                {
                    name: name,
                    icon: icon,
                    content: content,
                    active: Boolean(active)
                }
            );
        }
        return this;
    }

    /**
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
     * @returns {void}
     * @private
     */
    _addEventToAction() {
        for (let i = 0; i < this._options.length; i++) {
            let item = this.getViewAction(i);
            item.addEvent('click', () => {
                this.toggleTab(i);
            });

            let itemClose = this.getViewAction('close-' + i);
            itemClose.addEvent('click', (e) => {
                e.cancelBubble = true;
                this.closeTab(i);
            });
        }
    }

    /**
     *
     * @returns {UIElement}
     */
    getActiveTab() {
        return this.getView().findOne('.' + ACTIVE_TAB);
    }

    /**
     *
     * @returns {UIElement}
     */
    getActiveBlock() {
        return this.getView().findOne('.' + ACTIVE_BLOCK);
    }

    /**
     *
     * @param {string|number} key
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
     *
     * @param {string|number} key
     * @returns {?{tab: UIElement, content: UIElement, key: (string|number)}}
     */
    findNearestTab(key) {
        return this.findNextTab(key) || this.findPreviousTab(key);
    }

    /**
     *
     * @param {string|number} key
     * @returns {?{tab: UIElement, content: UIElement, key: (string|number)}}
     */
    findPreviousTab(key) {
        for (let i = (key - 1); i >= 0; i--) {
            if (this._isRemoved(i)) {
                continue;
            }
            let tab = this.getViewAction(i);
            if (tab) {
                return {
                    tab: tab,
                    content: this.getViewBlock(i),
                    key: i
                };
            }
        }
        return null;
    }

    /**
     *
     * @param {string|number} key
     * @returns {?{tab: UIElement, content: UIElement, key: (string|number)}}
     */
    findNextTab(key) {
        for (let i = (key + 1); i < this._options.length; i++) {
            if (this._isRemoved(i)) {
                continue;
            }
            let tab = this.getViewAction(i);
            if (tab) {
                return {
                    tab: tab,
                    content: this.getViewBlock(i),
                    key: i
                };
            }
        }
        return null;
    }

    /**
     *
     * @param {string|number} key
     * @returns {boolean}
     * @private
     */
    _isRemoved(key) {
        return this._removedItems.indexOf(key) >= 0;
    }

    /**
     *
     * @param {string|number} key
     * @returns {Tabs}
     */
    closeTab(key) {
        this._removedItems.push(key);
        this
            .removeViewAction(key)
            .removeViewBlock(key);

        if (!this.getActiveTab()) {
            this.activeNearestTab(key);
        }

        return this;
    }

    /**
     *
     * @param {string|number} key
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
     *
     * @param {string|number} key
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
}

export default Tabs;