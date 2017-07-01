const fs = require('fs');
const path = require('path');
const Error = require('./Error');

class Routes {

    /**
     *
     * @param {Components} config
     */
    constructor(config) {

        /**
         *
         * @type {Components}
         */
        this.conf = config;

        /**
         *
         * @type {Array}
         */
        this.routes = [];
    }

    /**
     * @param {{}} routes
     * @callback loadComplete
     */

    /**
     * This method are uploading file of routes configuration and put them to property "<IW.Request.routes>"
     *
     * @param {loadComplete} callback
     * @returns {Routes}
     */
    load(callback) {
        let scope = this;
        let path = this.joinPath(__dirname, '/../../' + this.conf.pathRoutes);

        fs.readdir(path, function (err, files) {
            if (err) {
                new Error(err).message('Route.load()');
                return;
            }

            for (let i = 0; i < files.length; i++ ) {
                var data = require(scope.joinPath(path, files[i]));

                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        data[key]['name'] = key;
                        scope.routes.push(data[key]);
                    }
                }
            }

            callback.call(this, scope.routes);
        });
        return this;
    };

    /**
     * Get all routes
     *
     * @returns {Array}
     */
    getAll() {
        return this.routes;
    };

    /**
     *
     * @param {string} dir - possible value ( '/var/www/project/' )
     * @param {string} str - possible value ( '/path/to/file' )
     * @returns {string}
     */
    joinPath(dir, str) {
        return path.join(dir, str);
    };
}

/**
 *
 * @module Routes
 */
module.exports = Routes;
