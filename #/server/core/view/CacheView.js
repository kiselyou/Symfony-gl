
class CacheView {
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
        this._data = [];
    }

    /**
     *
     * @returns {CacheView}
     */
    clear() {
        this._data = [];
        return this;
    };

    /**
     *
     * @returns {CacheView}
     */
    disable() {
        this._disable = true;
        return this;
    };

    /**
     *
     * @returns {CacheView}
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
    setData(route, patter) {
        if (this.disable) {
            return;
        }
        let itemRoute = this.findData(route);
        if (itemRoute) {
            let itemView = this.findView(route, patter.path);
            if (!itemView) {
                itemRoute.patterns.push(patter);
            }
        } else {
            this._data.push({route: route, patterns: [patter]});
        }
    };

    /**
     *
     * @param {string} route
     * @returns {?{route: string, patterns: Array}}
     */
    findData(route) {
        return this._data.find((item) => {
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
        var itemRoute = this.findData(route);
        if (!itemRoute) {
            return null;
        }
        return itemRoute.patterns.find((item) => {
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
        this.setData(route, {path: viewPath, view: view});
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
 * @module CacheView
 */
module.exports = CacheView;
