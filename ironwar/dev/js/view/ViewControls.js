
import ViewPathControls from './ViewPathControls';

import Login from './authorization/Login';
import Registration from './authorization/Registration';

class ViewControls {

    constructor() {

        /**
         *
         * @type {Login}
         * @private
         */
        this._login = new Login(ViewPathControls.PATH_LOGIN);

        /**
         *
         * @type {Registration}
         * @private
         */
        this._registration = new Registration(ViewPathControls.PATH_REGISTRATION);
    }

    initSecurityForm() {
        this._login.upload(() => {
            this._login.show();

            this._registration.upload(() => {

                this._login.eventBtnRegistration(() => {
                    this._login.hide();
                    this._registration.show();
                });

                this._login.eventBtnSignIn((formData) => {
                    console.log(formData);
                });

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
