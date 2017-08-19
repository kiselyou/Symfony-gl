import View from '../../system/View';
import {ACTION_OPEN_FORM, ACTION_SEND_FORM} from '../actions.js';

class Login extends View {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super(path);
    }

    /**
     * Make something when click on button "registration"
     *
     * @param listener
     * @returns {Login}
     */
    eventBtnRegistration(listener) {
        let btn = this.el.getElementByActionName(ACTION_OPEN_FORM);
        btn.addEvent('click', listener);
        return this;
    }

    /**
     * Make something when click on button "Sign in"
     *
     * @param listener
     * @returns {Login}
     */
    eventBtnSignIn(listener) {
        this.addActionSendForm(ACTION_SEND_FORM, '/iw/login', 'form', (res, status) => {
            console.log(res, status);
        });
        return this;
    }
}

export default Login;
