
import EJSController from './systems/EJSController';
import SocketController from './systems/SocketController';

class Collection {
    /**
     *
     *
     * @param {Server} server
     */
    constructor(server) {
        this._collections = {};
        this._collections['EJSController'] = new EJSController(server);
        this._collections['SocketController'] = new SocketController(server);
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

export default Collection;
