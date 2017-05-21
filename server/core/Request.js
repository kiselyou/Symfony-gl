var fs = require('fs');

var IW = IW || {};

/**
 *
 * @param {{}} config
 * @constructor
 */
IW.Request = function (config) {

    this.DIR_APP = getEnvironment(config);
    this.PATH_APP = __dirname + '/../../' + this.DIR_APP;
    this.PATH_TEMPLATES = this.PATH_APP + IW.Request.DIR_TEMPLATES;
    this.PATH_TEMPLATES_JS = this.PATH_TEMPLATES + IW.Request.TEMPLATE_JS;
    this.PATH_TEMPLATES_HTML = this.PATH_TEMPLATES + IW.Request.TEMPLATE_HTML;
    this.PATH_ROUTES = __dirname + IW.Request.DIR_ROUTES;
    this._loadRoutes();

    /**
     * Get directory of environment
     *
     * @param {{environment: {app: boolean, dist: boolean}}} config
     * @returns {string} possible values ( 'app' | 'dist' )
     */
    function getEnvironment(config) {
        for (var environment in config.environment) {
            if (config.environment.hasOwnProperty(environment) && config.environment[environment]) {
                return environment;
            }
        }
        return 'app';
    }
};

/**
 *
 * @type {Array}
 */
IW.Request.prototype.routes = [];

/**
 * This method are uploading file of routes configuration and put them to property "<IW.Request.routes>"
 *
 * @returns {void}
 * @private
 */
IW.Request.prototype._loadRoutes = function () {
    try {

        var filedRoute = fs.readdirSync(this.PATH_ROUTES);

        for ( var r = 0; r < filedRoute.length; r++ ) {
            var path = this.concatPath(this.PATH_ROUTES, filedRoute[ r ]);
            var data = require(path);
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    data[key]['name'] = key;
                    this.routes.push(data[key]);
                }
            }
        }

    } catch (error) {
        console.log('Can not load routes', error);
    }
};

/**
 * @returns {Array}
 */
IW.Request.prototype.getRoutes = function () {
    return this.routes;
};

/**
 *
 * @param {string} dir - possible value ( '/var/www/project/' | '/var/www/project/' )
 * @param {string} str - possible value ( '/path/to/file' )
 * @returns {string}
 */
IW.Request.prototype.concatPath = function (dir, str) {
    return dir.replace(/(\/)$/, '') + '/' + str.replace(/^(\/)/, '');
};

IW.Request.TEMPLATE_JS = '/js';
IW.Request.TEMPLATE_HTML = '/html';
IW.Request.DIR_TEMPLATES = '/patterns';
IW.Request.DIR_ROUTES = '/../routing';

module.exports = IW;
