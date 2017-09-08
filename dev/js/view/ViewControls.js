
import View from './View';
import Validator from './../system/Validator';
import Application from './../system/Application';

import {ACTION_DESKTOP_CLOSE} from '../view/view-actions.js';

class ViewControls extends View {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {
        super(container);

        /**
         *
         * @type {Object.<Validator>}
         */
        this.validator = {};

        /**
         *
         * @type {Application}
         * @private
         */
        this._app = new Application();
    }

    /**
     *
     * @returns {Application}
     */
    get app() {
        return this._app;
    }

    /**
     *
     * @param {UIElement}
     * @callback desktopClosedListener
     */

    /**
     *
     * @param {desktopClosedListener} [listener]
     * @param {boolean} close If false desktop will not close and you need custom control it
     * @returns {View}
     */
    addActionDesktopClose(listener, close = true) {
        let el = this.el.getElementByActionName(ACTION_DESKTOP_CLOSE);
        if (el) {
            el.addEvent('click', () => {
                if (listener) {
                    listener(this.el);
                }
                if (close) {
                    this.el.hide(true);
                }
            });
        }
        return this;
    }

    /**
     * @param {(Array|string)} res
     * @param {boolean} status
     * @returns {void}
     * @callback sendFormListener
     */

    /**
     * Send form data to server by method POST is using specific action
     *
     * @param {string} actionName - name of action
     * @param {string} path - path to the server
     * @param {string|FormData|Object} form - string is selector of form
     * @param {sendFormListener} [sendForm]
     */
    addActionSendForm(actionName, path, form, sendForm) {
        let el = this.el.getElementByActionName(actionName);
        el.addEvent('click', () => {
            let data = typeof form === 'string' ? new FormData(this.el.findOne(form).getElement()) : form;
            if (this.validator.hasOwnProperty(actionName)) {
                let validator = this.validator[actionName];
                validator.start(data);
                if (validator.isError()) {
                    sendForm(validator.getMessages(), false);
                } else {
                    this._viewAjax(path, data, sendForm);
                }
            } else {
                this._viewAjax(path, data, sendForm);
            }
        });
    }

    /**
     *
     * @param {string} actionName - name of action
     * @param {string} fieldName - name of filed
     * @param {string} rule - It is constants of class "Validator"
     * @param {?string|number|Array} [mark] - It is value to need check.
     *        In some cases this value can have array
     *        e.g.
     *           Validator.RULE_LENGTH_BETWEEN_VALUES need set mark [2, 8]. It means that value have to be more or equal 2 and less or equal 8
     *           Validator.RULE_MAX_LENGTH need set mark to 20 or some another value
     * @param {?string} [message] - Message
     * @returns {View}
     */
    addValidateRule(actionName, fieldName, rule, mark = null, message = null) {
        if (!this.validator.hasOwnProperty(actionName)) {
            this.validator[actionName] = new Validator(this.el);
        }
        this.validator[actionName].rule(fieldName, rule, mark, message);
        return this;
    }

    /**
     *
     * @param {string} actionName - name of action
     * @param {?boolean} status - true (Fields only with status true)
     *                            false (Fields only with status false)
     *                            null (Fields with any status)
     * @param {listenerCheckedField} listener
     * @returns {View}
     */
    findCheckedFields(actionName, status, listener) {
        if (this.validator.hasOwnProperty(actionName)) {
            this.validator[actionName].findCheckedFields(status, listener);
        }
        return this;
    }

    /**
     * Send request to server
     *
     * @param {string} path
     * @param {Object} data
     * @param {sendFormListener} listener
     * @private
     */
    _viewAjax(path, data, listener) {
        let ajax = this.app.ajax.post(path, data);
        if (listener) {
            ajax
                .then((res) => {
                    listener(res, true);
                })
                .catch((error) => {
                    listener(error, false);
                });
        }
    }
}

export default ViewControls;