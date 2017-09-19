
import WindowAlert from './../../view/window/WindowAlert';

class UIMessage {

    constructor() {

        /**
         *
         * @type {WindowAlert}
         * @private
         */
        this._alert = new WindowAlert();
    }

    /**
     *
     * @param {UIElement} button
     * @param {UIElement} windowView
     * @callback actionYes
     */

    /**
     *
     * @param {string} msg
     * @param {string} [title]
     * @param {actionYes} [listener]
     * @returns {UIMessage}
     */
    alert(msg, title, listener) {
        this._alert.show(msg, title, listener);
        return this;
    }
}

export default UIMessage;
