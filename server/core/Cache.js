var IW = IW || {};

/**
 *
 * @param {boolean} [disable]
 * @constructor
 */
IW.Cache = function (disable) {
    this.disable = disable ? disable : false;
};

/**
 *
 * @type {boolean}
 */
IW.Cache.prototype.disable = false;

/**
 *
 * @type {Array}
 */
IW.Cache.prototype.routes = [];

/**
 *
 * @returns {IW.Cache}
 */
IW.Cache.prototype.clear = function () {
    this.routes = [];
    return this;
};

/**
 *
 * @returns {IW.Cache}
 */
IW.Cache.prototype.disableCache = function () {
    this.disable = true;
    return this;
};

/**
 *
 * @returns {IW.Cache}
 */
IW.Cache.prototype.enableCache = function () {
    this.disable = false;
    return this;
};

/**
 *
 * @param {string} route
 * @param {{path: string, view: string}} patter
 * @returns {void}
 * @private
 */
IW.Cache.prototype._setRoute = function (route, patter) {
    if (this.disable) {
        return;
    }
    var itemRoute = this.findRoute(route);

    if (!itemRoute) {
        this.routes.push(
            {
                route: route,
                patterns: [patter]
            }
        );
    } else {

        var itemView = this.findView(route, patter.path);

        if (!itemView) {
            itemRoute.patterns.push(patter);
        }
    }
};

/**
 *
 * @param {string} route
 * @returns {?{route: string, patterns: Array}}
 */
IW.Cache.prototype.findRoute = function (route) {
    return this.routes.find(function (item) {
        return item.route === route;
    });
};

/**
 *
 * @param {string} route
 * @param {string} viewPath
 * @returns {?{path: string, view: string}}
 */
IW.Cache.prototype.findView = function (route, viewPath) {
    var itemRoute = this.findRoute(route);

    if (!itemRoute) {
        return null;
    }

    return itemRoute.patterns.find(function (item) {
        return item.path === viewPath;
    });
};

/**
 *
 * @param {string} route
 * @param {string} viewPath
 * @param {string} view
 * @returns {void}
 */
IW.Cache.prototype.add = function (route, viewPath, view) {
    this._setRoute(
        route,
        {
            path: viewPath,
            view: view,
        }
    );
};

/**
 *
 * @param {string} route
 * @param {string} viewPath
 * @returns {?string}
 */
IW.Cache.prototype.get = function (route, viewPath) {
    var pattern = this.findView(route, viewPath);
    if (!pattern) {
        return null;
    }
    return pattern.view;
};

module.exports = IW;
