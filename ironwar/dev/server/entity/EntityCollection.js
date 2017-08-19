import Users from './systems/Users';
import Roles from './systems/Roles';

class EntityCollection {
    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._collections = {};
        this._collections['Users'] = new Users(server.db);
        this._collections['Roles'] = new Roles(server.db);
    }

    /**
     * Get collection of Entities
     *
     * @returns {{}|*}
     */
    get() {
        return this._collections;
    }
}

export default EntityCollection;
