import View from '../../system/View';

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
        let btn = this.el.getElementByActionName(Registration.NAME_ACTION_OPEN_LOGIN);
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
        let btn = this.el.getElementByActionName(Registration.NAME_ACTION_SEND);
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
    static get NAME_ACTION_OPEN_LOGIN() {
        return 'open-login-form';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get NAME_ACTION_SEND() {
        return 'send-registration-form';
    }
}

export default Registration;
