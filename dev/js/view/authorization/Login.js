import ViewRender from '../../view/ViewRender';
import Informer from './../informer/Informer';
import Validator from './../../system/Validator';

const ACTION_OPEN_FORM = 'open-form';
const ACTION_SEND_FORM = 'send-form';
const VIEW_BLOCK_WARNING = 'warning';

/**
 * @extends View
 */
class Login extends ViewRender {
    /**
     *
     * @param {string} viewName - It is template name
     */
    constructor(viewName) {
        super(viewName);

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
     * @param {Object} res - The is response from server
     * @callback responseListener
     */

    /**
     * Make something when click on button "Sign in"
     *
     * @param {responseListener} [success]
     * @returns {Login}
     */
    setEventBtnSignIn(success) {
        this.addValidateRule(ACTION_SEND_FORM, 'username', Validator.RULE_LENGTH_BETWEEN_VALUES, [5, 20]);
        this.addValidateRule(ACTION_SEND_FORM, 'password', Validator.RULE_LENGTH_BETWEEN_VALUES, [6, 20]);

        this.addActionSendForm(ACTION_SEND_FORM, '/iw/login', 'form', (res, status) => {
            let block = this.el.getElementByBlockName(VIEW_BLOCK_WARNING);

            if (status) {
                try {
                    let data = JSON.parse(res);
                    if (data['status']) {
                        this.app.lock.lock();
                        if (success) {
                            success(data);
                        }
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
        });
        return this;
    }
}

export default Login;
