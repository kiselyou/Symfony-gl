
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
}


export default ViewControls;
