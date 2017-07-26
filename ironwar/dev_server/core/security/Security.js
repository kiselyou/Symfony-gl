import Authorization from './Authorization';

class Security extends Authorization {
    /**
     *
     * @type {Server}
     */
    constructor(server) {
        super(server);

        /**
         *
         * @type {Conf}
         */
        this._conf = server.getConfig();
    }

    /**
     *
     * @param {string} route
     * @param {string} role - It is role of user
     * @returns {boolean}
     */
    isGranted(route, role) {
        for (let item of this._conf.accessControl) {
            let grant = route.replace(/^\/|\/$/g, '').split('/', 1);
            if (grant[0] === item['path'].replace(/^\/|\/$/g, '')) {
                return !item.hasOwnProperty('role') || role === item['role'] || this.hasRole(role, item['role']);
            }
        }
        return true;
    }

    /**
     *
     * @param {string} roleParent - Parent role. Role where will find children role
     * @param {string} roleChildren - Children role
     * @returns {boolean}
     */
    hasRole(roleParent, roleChildren) {
        let has = false;
        let hierarchy = this._conf.roleHierarchy;
        if (hierarchy.hasOwnProperty(roleParent)) {
            for (let role of hierarchy[roleParent]) {
                has = roleChildren === role ? true : this.hasRole(role, roleChildren);
            }
        }
        return has;
    }
}

/**
 *
 * @module Security
 */
export default Security;
