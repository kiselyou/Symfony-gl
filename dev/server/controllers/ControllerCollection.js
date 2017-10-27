
import EJSController from './loader/EJSController';
import SocketController from './systems/SocketController';
import SecurityController from './systems/SecurityController';

import OBJController from './loader/OBJController';
import SettingsController from './user/SettingsController';

class ControllerCollection {
    /**
     *
     *
     * @param {Server} server
     */
    constructor(server) {
        this._collections = {};
        this._collections['EJSController'] = new EJSController(server);
        this._collections['SocketController'] = new SocketController(server);
        this._collections['SecurityController'] = new SecurityController(server);
        this._collections['OBJController'] = new OBJController(server);
        this._collections['SettingsController'] = new SettingsController(server);
    }

    /**
     * Get collections
     *
     * @returns {{}|*}
     */
    get(controller) {
        return this._collections[controller];
    }
}

export default ControllerCollection;
