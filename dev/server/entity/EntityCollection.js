import Users from './systems/Users';
import Roles from './systems/Roles';
import Volume from './settings/Volume';

class EntityCollection {
    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        let db = server['db'];
        this._collections = {};
        this._collections['Users'] = new Users(db, this);
        this._collections['Roles'] = new Roles(db, this);
        this._collections['Volume'] = new Volume(db, this);
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
