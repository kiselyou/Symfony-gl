import View from '../../system/View';

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
        let btn = this.el.getElementByActionName(Login.NAME_ACTION_OPEN_REGISTRATION);
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
        let btn = this.el.getElementByActionName(Login.NAME_ACTION_SEND);
        btn.addEvent('click', () => {
            listener(new FormData(this.el.findOne('form')));
        });
        return this;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get NAME_ACTION_OPEN_REGISTRATION() {
        return 'open-registration-form';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get NAME_ACTION_SEND() {
        return 'send-login-form';
    }
}

export default Login;
