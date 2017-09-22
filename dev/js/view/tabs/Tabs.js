
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
        this._options.push(
            {
                name: name,
                icon: icon,
                content: content,
                active: Boolean(active)
            }
        );
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
        super
            .build(this._viewName)
            .showView();

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
                console.log(12);
                this.toggleTab(i);
            });

            let itemClose = this.getViewAction('close-' + i);
            itemClose.addEvent('click', (e) => {
                console.log(e);
                e.preventDefault();
                // this.closeTab(i);
                // this.toggleTab(i - 1);
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
     * @returns {Tabs}
     */
    closeTab(key) {
        let tab = this.getViewAction(key);
        tab.remove();
        let block = this.getViewBlock(key);
        block.remove();
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