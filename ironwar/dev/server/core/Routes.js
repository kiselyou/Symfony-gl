import fs from 'fs';
import path from 'path';

/**
 *
 * @type {string}
 */
const DIR_ROUTES = './../routing';

class Routes {

    /**
     *
     */
    constructor() {

        /**
         *
         * @type {Array}
         * @private
         */
        this._routes = [];
    }

    /**
     * @param {Array.<Routes.routes>} routes
     * @callback loadComplete
     */

    /**
     * This method are uploading file of routes configuration and put them to property "<Routes.routes>"
     *
     * @param {loadComplete} callback
     * @returns {Routes}
     */
    load(callback) {
        let dir = path.join(__dirname, DIR_ROUTES);

        fs.readdir(dir, (err, files) => {
            if (err) {
                console.log('Cannot upload file of routes', 'Routes', 'load');
                return;
            }

            let i = 0;
            for (let fileName of files) {
                let filePath = path.join(dir, fileName);
                fs.readFile(filePath, 'utf8', (err, data) => {

                    if (err) {
                        console.log('Cannot read file of route', 'Routes', 'load');
                        return;
                    }

                    try {
                        let obj = JSON.parse(data);

                        for (let key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                obj[key]['name'] = key;
                                this._routes.push(obj[key]);
                            }
                        }

                        i++;

                        if (i === files.length) {
                            callback(this._routes);
                        }
                    } catch (e) {
                        console.log('Cannot read file of route', 'Routes', 'load', e);
                    }
                });
            }
        });
        return this;
    };

    /**
     *
     * Send response to client
     *
     * @param {string} str
     * @returns {Server}
     */
    responseView(str) {
        this.res.writeHead(200, this.conf.contentType());
        this.res.end(str, this.conf.encoding, true);
        return this;
    };

    /**
     * Get all routes
     *
     * @returns {Array}
     */
    getAll() {
        return this._routes;
    };

    /**
     *
     * @param {string} name
     * @returns {*}
     */
    get(name) {
        return this._routes.find((route) => {
            return name === route['name'];
        });
    }
}

/**
 *
 * @module Routes
 */
export default Routes;
