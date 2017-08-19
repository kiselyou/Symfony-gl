
import EJSController from './systems/EJSController';
import SocketController from './systems/SocketController';
import SecurityController from './systems/SecurityController';

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
    }

    /**
     * Get collections
     *
     * @returns {{}|*}
     */
    get() {
        return this._collections;
    }
}

export default ControllerCollection;
