const Authorization = require('./Authorization.js');

class Security extends Authorization {
    /**
     *
     * @type {Components}
     */
    constructor(config) {
        super(config);
        /**
         *
         * @type {Components}
         */
        this.conf = config;
    }

    /**
     *
     * @param {string} route
     * @param {string} role - It is role of user
     * @returns {boolean}
     */
    isGranted(route, role) {
        var pathControls = this.conf.accessControl;

        for (var i = 0; i < pathControls.length; i++) {
            var find = pathControls[i]['path'].replace(/^\/|\/$/g, '');
            var grant = route.replace(/^\/|\/$/g, '').split('/', 1);
            if (grant[0] == find) {
                return !pathControls[i].hasOwnProperty('role') || role === pathControls[i]['role'] || this.hasRole(role, pathControls[i]['role']);
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
        var has = false;
        var hierarchy = this.conf.roleHierarchy;
        if (hierarchy.hasOwnProperty(roleParent)) {
            for (var i = 0; i < hierarchy[roleParent].length; i++) {
                has = roleChildren === hierarchy[roleParent][i] ? true : this.hasRole(hierarchy[roleParent][i], roleChildren);
            }
        }
        return has;
    }
}

/**
 *
 * @module Security
 */
module.exports = Security;
