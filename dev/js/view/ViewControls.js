import Lock from './../system/Lock';
import Login from './authorization/Login';
import Registration from './authorization/Registration';
import Application from './../system/Application';
import MenuControls from './menu/MenuControls';
import {VIEW_PATH_LOGIN, VIEW_PATH_REGISTRATION} from './view-path';

/**
 * Class representing views
 *
 * @extends Application
 */
class ViewControls extends Application {

    constructor() {
        super();

        /**
         *
         * @type {Lock}
         */
        this.lock = new Lock();

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

        /**
         *
         * @type {MenuControls}
         */
        this.menu = new MenuControls(this.lock);
    }

    /**
     * Initialisation form "registration" and "login"
     *
     * @returns {ViewControls}
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
                    .setEventBtnSignIn((res) => {
                        this.lock.lock();
                        this.menu.checkLock();
                    })
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
            });

        return this;
    }
}


export default ViewControls;
