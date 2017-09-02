import View from '../../system/View';
import Informer from './../informer/Informer';
import Validator from './../../system/Validator';

import {
    ACTION_OPEN_FORM,
    ACTION_SEND_FORM
} from '../view-actions.js';

import {
    VIEW_BLOCK_WARNING
} from '../view-blocks.js';

class Registration extends View {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super(path);

        /**
         *
         * @type {Informer}
         */
        this.informer = new Informer();
    }

    /**
     * Clean block warning and return block element
     *
     * @returns {Registration}
     */
    cleanBlockWarning() {
        this.el.getElementByBlockName(VIEW_BLOCK_WARNING).clean();
        return this;
    }

    /**
     * Make something when click on button "Login"
     *
     * @param listener
     * @returns {Registration}
     */
    eventBtnLogin(listener) {
        let btn = this.el.getElementByActionName(ACTION_OPEN_FORM);
        btn.addEvent('click', listener);
        return this;
    }

    /**
     * @param {Object} res
     * @param {boolean} status - If error value is false else true
     * @callback responseListener
     */

    /**
     * Make something when click on button "Registration"
     *
     * @param {responseListener} [responseListener]
     * @returns {Registration}
     */
    eventBtnRegistration(responseListener) {

        this.addValidateRule(ACTION_SEND_FORM, 'email', Validator.RULE_IS_EMAIL);
        this.addValidateRule(ACTION_SEND_FORM, 'username', Validator.RULE_LENGTH_BETWEEN_VALUES, [5, 20]);
        this.addValidateRule(ACTION_SEND_FORM, 'password', Validator.RULE_LENGTH_BETWEEN_VALUES, [6, 20]);
        this.addValidateRule(ACTION_SEND_FORM, 'confirm_password', Validator.RULE_EQUAL_FIELD, 'password');

        this.addActionSendForm(ACTION_SEND_FORM, '/iw/registration', 'form', (res, status) => {
            if (responseListener) {
                responseListener(res, status);
            } else {
                let block = this.el.getElementByBlockName(VIEW_BLOCK_WARNING);
                if (status) {
                    try {
                        let data = JSON.parse(res);
                        if (data['status']) {
                            this.informer.success(block, data['msg']);
                        } else {
                            this.informer.warning(block, data['msg']);
                        }
                    } catch (e) {
                        this.informer.danger(block, 'Something was broken');
                    }
                } else {
                    this.informer.warning(block, res);
                }
            }
        });
        return this;
    }
}

export default Registration;
