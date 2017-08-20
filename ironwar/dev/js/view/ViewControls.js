
import Login from './authorization/Login';
import Registration from './authorization/Registration';
import {VIEW_PATH_LOGIN, VIEW_PATH_REGISTRATION} from './view-path';

class ViewControls {

    constructor() {
        /**
         *
         * @type {Login}
         * @private
         */
        this._login = new Login(VIEW_PATH_LOGIN);

        /**
         *
         * @type {Registration}
         * @private
         */
        this._registration = new Registration(VIEW_PATH_REGISTRATION);
    }

    /**
     * Initialisation form "registration" and "login"
     *
     * @returns {ViewControls}
     */
    initSecurityForm() {
        this._login.upload(() => {
            this._login
                .addActionDesktopClose()
                .show();

            this._registration.upload(() => {
                this._registration.addActionDesktopClose();
                this._registration.eventBtnRegistration();
                this._registration.eventBtnLogin(() => {
                    this._registration
                        .cleanBlockWarning()
                        .hide();
                    this._login.show();
                });

                this._login.setEventBtnSignIn();
                this._login.setEventBtnRegistration(() => {
                    this._login
                        .cleanBlockWarning()
                        .hide();
                    this._registration.show();
                });
            });
        });
        return this;
    }
}


export default ViewControls;
