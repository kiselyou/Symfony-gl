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

/**
 * @extends View
 */
class Login extends View {
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
     * @returns {Login}
     */
    cleanBlockWarning() {
        this.el.getElementByBlockName(VIEW_BLOCK_WARNING).clean();
        return this;
    }

    /**
     * Make something when click on button "registration"
     *
     * @param listener
     * @returns {Login}
     */
    setEventBtnRegistration(listener) {
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
     * Make something when click on button "Sign in"
     *
     * @param {responseListener} [responseListener]
     * @returns {Login}
     */
    setEventBtnSignIn(responseListener) {

        this.addValidateRule(ACTION_SEND_FORM, 'username', Validator.RULE_IS_EMAIL);

        this.addActionSendForm(ACTION_SEND_FORM, '/iw/login', 'form', (res, status) => {
            if (responseListener) {
                responseListener(res, status);
            } else {
                let block = this.el.getElementByBlockName(VIEW_BLOCK_WARNING);

                if (status) {
                    try {
                        let data = JSON.parse(res);
                        if (data['status']) {
                            this.lock.lock();
                            this.hide();
                        } else {
                            this.informer.warning(block, data['msg']);
                        }
                    } catch (e) {
                        console.log(e);
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

export default Login;
