var IW = IW || {};

/**
 *
 * @param {{ security: { access_control: [], role_hierarchy: {},  } }} config - It is configuration from file "config.json"
 * @constructor
 */
IW.Security = function (config) {
    this.config = config;
};

/**
 * It is configuration from file "config.json"
 *
 * @type {{ security: { access_control: [], role_hierarchy: {},  } }}
 */
IW.Security.prototype.config = {};

/**
 * Get access control
 *
 * @returns {*[]}
 */
IW.Security.prototype.getPathsControl = function () {
    return this.config.security.access_control;
};

/**
 * Get roles Hierarchy
 *
 * @returns {{}}
 */
IW.Security.prototype.getRoleHierarchy = function () {
    return this.config.security.role_hierarchy;
};

/**
 *
 * @param {string} route
 * @param {string} role - It is role of user
 * @returns {boolean}
 */
IW.Security.prototype.isGranted = function (route, role) {
    var pathsControl = this.getPathsControl();

    for (var i = 0; i < pathsControl.length; i++) {
        var find = pathsControl[i]['path'].replace(/^\/|\/$/g, '');
        var grant = route.replace(/^\/|\/$/g, '').split('/', 1);
        if (grant[0] == find) {
            return !pathsControl[i].hasOwnProperty('role') || role == pathsControl[i]['role'] || this.hasRole(role, pathsControl[i]['role']);
        }
    }
    return true;
};

/**
 *
 * @param {string} roleParent - Parent role. Role where will find children role
 * @param {string} roleChildren - Children role
 * @returns {boolean}
 */
IW.Security.prototype.hasRole = function (roleParent, roleChildren) {
    var has = false;
    var hierarchy = this.getRoleHierarchy();
    if (hierarchy.hasOwnProperty(roleParent)) {
        for (var i = 0; i < hierarchy[roleParent].length; i++) {
            has = roleChildren === hierarchy[roleParent][i] ? true : this.hasRole(hierarchy[roleParent][i], roleChildren);
        }
    }
    return has;
};

/**
 *
 * @module Security
 */
module.exports = IW.Security;
