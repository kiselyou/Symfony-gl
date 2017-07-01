
class Cache {
    /**
     *
     * @param {boolean} [disable]
     */
    constructor(disable) {
        /**
         *
         * @type {boolean}
         * @private
         */
        this._disable = disable ? disable : false;

        /**
         *
         * @type {Array}
         */
        this.routes = [];
    }

    /**
     *
     * @returns {Cache}
     */
    clear() {
        this.routes = [];
        return this;
    };

    /**
     *
     * @returns {Cache}
     */
    disable() {
        this._disable = true;
        return this;
    };

    /**
     *
     * @returns {Cache}
     */
    enable() {
        this._disable = false;
        return this;
    };

    /**
     *
     * @param {string} route
     * @param {{path: string, view: string}} patter
     * @returns {void}
     * @private
     */
    setRoute(route, patter) {
        if (this.disable) {
            return;
        }
        let itemRoute = this.findRoute(route);
        if (itemRoute) {
            let itemView = this.findView(route, patter.path);
            if (!itemView) {
                itemRoute.patterns.push(patter);
            }
        } else {
            this.routes.push({route: route, patterns: [patter]});
        }
    };

    /**
     *
     * @param {string} route
     * @returns {?{route: string, patterns: Array}}
     */
    findRoute(route) {
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
    findView(route, viewPath) {
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
    add(route, viewPath, view) {
        this.setRoute(route, {path: viewPath, view: view});
    };

    /**
     *
     * @param {string} route
     * @param {string} viewPath
     * @returns {?string}
     */
    get(route, viewPath) {
        let pattern = this.findView(route, viewPath);
        return pattern ? pattern.view : null;
    };
}

/**
 *
 * @module Cache
 */
module.exports = Cache;
