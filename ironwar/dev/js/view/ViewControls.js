
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

    initSecurityForm() {
        this._login.upload(() => {
            this._login
                .addActionDesktopClose()
                .show();

            this._registration.upload(() => {

                this._registration.addActionDesktopClose();

                this._login.setEventBtnRegistration(() => {
                    this._login.hide();
                    this._registration.show();
                });

                this._login.setEventBtnSignIn();

                this._registration.eventBtnLogin(() => {
                    this._registration.hide();
                    this._login.show();
                });

                this._registration.eventBtnRegistration((formData) => {
                    console.log(formData);
                });
            });
        });
    }
}


export default ViewControls;
