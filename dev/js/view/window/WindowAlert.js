import View from '../../view/View';

import {
    VIEW_NAME_WINDOW_ALERT
} from './../../ini/ejs.ini';

const ACTION_CLOSE = 'close';
const ACTION_YES = 'yes';

class WindowAlert extends View {
    constructor() {
        super();
    }

    /**
     *
     * @param {UIElement} button
     * @param {UIElement} windowView
     * @callback actionYes
     */

    /**
     * Add to page and show element
     *
     * @param {string} msg
     * @param {string} [title]
     * @param {actionYes} [listener]
     * @returns {WindowAlert}
     */
    show(msg, title, listener) {
        this.viewOptions = {
            msg: msg ? msg : '',
            title: title ? title : ''
        };

        this._prepare(listener);
        super.showView();
        return this;
    }

    /**
     * Remove element
     *
     * @returns {WindowAlert}
     */
    hide() {
        this.removeView();
        return this;
    }

    /**
     * Build and add view to page
     *
     * @returns {WindowAlert}
     * @private
     */
    _prepare(listener) {
        this.build(VIEW_NAME_WINDOW_ALERT);

        let btnClose = this.viewElement.getElementByActionName(ACTION_CLOSE);
        btnClose.addEvent('click', () => {
            this.hideView();
        });

        let btnYes = this.viewElement.getElementByActionName(ACTION_YES);
        btnYes.addEvent('click', (e) => {
            this.hideView();
            listener ? listener(e, this.viewElement) : null;
        });
        return this;
    }
}

export default WindowAlert;
