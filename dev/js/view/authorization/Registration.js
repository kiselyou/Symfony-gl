import ViewRender from '../../view/ViewRender';
import Informer from './../informer/Informer';
import Validator from './../../system/Validator';

const ACTION_OPEN_FORM = 'open-form';
const ACTION_SEND_FORM = 'send-form';
const VIEW_BLOCK_WARNING = 'warning';

class Registration extends ViewRender {
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
     * @param {Object} res - The is response from server
     * @callback responseListener
     */

    /**
     * Make something when click on button "Registration"
     *
     * @param {responseListener} [success]
     * @returns {Registration}
     */
    eventBtnRegistration(success) {

        this.addValidateRule(ACTION_SEND_FORM, 'email', Validator.RULE_IS_EMAIL);
        this.addValidateRule(ACTION_SEND_FORM, 'username', Validator.RULE_LENGTH_BETWEEN_VALUES, [5, 20]);
        this.addValidateRule(ACTION_SEND_FORM, 'password', Validator.RULE_LENGTH_BETWEEN_VALUES, [6, 20]);
        this.addValidateRule(ACTION_SEND_FORM, 'confirm_password', Validator.RULE_EQUAL_FIELD, 'password');

        this.addActionSendForm(ACTION_SEND_FORM, '/iw/registration', 'form', (res, status) => {
            let block = this.el.getElementByBlockName(VIEW_BLOCK_WARNING);
            if (status) {
                try {
                    let data = JSON.parse(res);
                    if (data['status']) {
                        if (success) {
                            success(data);
                        }
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
        });
        return this;
    }
}

export default Registration;
