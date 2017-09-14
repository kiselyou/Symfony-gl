
import Login from './authorization/Login';
import Logout from './authorization/Logout';
import Registration from './authorization/Registration';
import Application from './../system/Application';
import MenuControls from './menu/MenuControls';
import {VIEW_NAME_LOGIN, VIEW_NAME_REGISTRATION} from './../ini/ejs.ini';

/**
 * Class representing views
 *
 * @extends Application
 */
class ViewBundle extends Application {

    constructor() {
        super();
        /**
         * Form login
         *
         * @type {Login}
         * @private
         */
        this._login = new Login(VIEW_NAME_LOGIN);

        /**
         * Form registration
         *
         * @type {Registration}
         * @private
         */
        this._registration = new Registration(VIEW_NAME_REGISTRATION);

        /**
         *
         * @type {MenuControls}
         */
        this.menu = new MenuControls();
    }

    /**
     * Initialisation form "registration" and "login"
     *
     * @returns {ViewBundle}
     */
    initSecurityForm() {

        this._login.upload(() => {
            this._login.addActionDesktopClose();

            this._registration.upload(() => {
                this._registration
                    .addActionDesktopClose()
                    .eventBtnRegistration()
                    .eventBtnLogin(() => {
                        this._login.show();
                        this._registration
                            .cleanBlockWarning()
                            .hide();
                });
                this._login
                    .setEventBtnSignIn()
                    .setEventBtnRegistration(() => {
                        this._registration.show();
                        this._login
                            .cleanBlockWarning()
                            .hide();
                });
            });
        });

        this.menu
            .openMenu(() => {
                this._login.hide();
                this._registration.hide();
            })
            .openFormLogin(() => {
                this._login.show();
            })
            .openFormRegistration(() => {
                this._registration.show();
            })
            .logout(() => {
                Logout.get().run();
            });

        return this;
    }
}


export default ViewBundle;
