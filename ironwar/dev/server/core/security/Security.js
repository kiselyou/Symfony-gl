
class Security {
    /**
     *
     * @param {Conf} config
     */
    constructor(config) {

        /**
         *
         * @type {Conf}
         */
        this._conf = config;
    }

    /**
     * Check permission by roles
     *
     * @param {string} route
     * @param {Array|string} roles - It is roles of user. For string is possible delimiter "|"
     * @returns {boolean}
     */
    isGranted(route, roles) {
        if (typeof roles === 'string') {
            roles = roles.split('|');
        }

        for (let role of roles) {
            role = typeof role === 'object' ? role['role'] : role;
            if (this.checkAccess(route, role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check permission by role
     *
     * @param {string} route
     * @param {Array} role - It is roles of user
     * @returns {boolean}
     */
    checkAccess(route, role) {
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
