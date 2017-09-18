import View from '../../view/View';

import {
    VIEW_NAME_WINDOW_ALERT
} from './../../ini/ejs.ini';

const ACTION_CLOSE = 'close';
const ACTION_YES = 'yes';
const BLOCK_TITLE = 'title';
const BLOCK_MESSAGE = 'msg';

class WindowAlert extends View {
    constructor() {
        super();

        this.viewOptions = {
            msg: '',
            title: ''
        };

        this.listener = null;
        this.build(VIEW_NAME_WINDOW_ALERT);
        let el = this.viewElement;
        /**
         *
         * @type {UIElement}
         * @private
         */
        this._blockTitle = el.getElementByBlockName(BLOCK_TITLE);

        /**
         *
         * @type {UIElement}
         * @private
         */
        this._blockMessage = el.getElementByBlockName(BLOCK_MESSAGE);

        /**
         *
         * @type {UIElement}
         * @private
         */
        this._btnClose = el.getElementByActionName(ACTION_CLOSE);

        /**
         *
         * @type {UIElement}
         * @private
         */
        this._btnYes = el.getElementByActionName(ACTION_YES);

        this._btnClose.addEvent('click', () => {
            this.hide();
        });

        this._btnYes.addEvent('click', () => {
            this.hide();
            this.listener ? this.listener(e, this.viewElement) : null;
        });
    }

    /**
     *
     * @param {UIElement} button
     * @param {UIElement} window
     * @callback actionYes
     */

    /**
     *
     * @param {string} msg
     * @param {string} title
     * @param {actionYes} listener
     * @returns {WindowAlert}
     */
    show(msg, title, listener) {
        this._blockMessage.setText(msg ? msg : '');
        this._blockTitle.setText(title ? title : '');
        this.listener = listener;
        super.show();
        return this;
    }

    hide() {
        super.hide();
        return this;
    }
}

export default WindowAlert;
