import View from '../../system/View';
import {ACTION_OPEN_FORM, ACTION_SEND_FORM} from '../actions.js';

class Registration extends View {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super(path);
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
     * Make something when click on button "Registration"
     *
     * @param listener
     * @returns {Registration}
     */
    eventBtnRegistration(listener) {
        this.addActionSendForm(ACTION_SEND_FORM, '/iw/registration', 'form', (res, status) => {
            console.log(res, status);
        });
        return this;
    }
}

export default Registration;
