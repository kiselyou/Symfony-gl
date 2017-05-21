
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var IW = require('./TemplateLoader') || {};

IW.Routes = function ( config ) {
    IW.TemplateLoader.call(this, config);
    this.config = config;
};

/**
 *
 * @type {IW.TemplateLoader}
 */
IW.Routes.prototype = Object.create(IW.TemplateLoader.prototype);
IW.Routes.prototype.constructor = IW.Routes;

/**
 * Initialisation of routes
 *
 * @returns {Array}
 */
IW.Routes.prototype._control = function () {
    for (var i = 0; i < this.routes.length; i++) {
        /**
         *
         * @type {{type: string, route: string, method: string, viewPath: string }}
         */
        var route = this.routes[i];
        switch (route['type']) {
            case 'pattern':
                this._createRoute(route['route'], route['method'], route['viewPath']);
                break;
        }
    }
};

/**
 * Create route
 *
 * @param {string} route - It is HTTP route
 * @param {method} method - possible values ( 'GET' | 'POST' )
 * @param {string} viewPath - It is path to html pattern
 * @returns {void}
 */
IW.Routes.prototype._createRoute = function (route, method, viewPath) {
    var scope = this;
    switch (method) {
        case 'POST':
            app.post(route, function (req, res) {
                scope._response(res, scope.uploadPattern(res, viewPath));
            });
            break;
        default:
            app.get(route, function (req, res) {
                scope._response(res, scope.uploadPattern(res, viewPath));
            });
            break;
    }
};

/**
 * Send response to client
 *
 * @param {{}} res
 * @param {{ status: boolean, content: string, error: string }} pattern
 * @private
 */
IW.Routes.prototype._response = function (res, pattern) {
    if (pattern.status) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(pattern.content, this.config.encoding, true);
    } else {
        res.writeHead(500);
        res.end(pattern.content);
        console.log(pattern.error);
    }
};

/**
 * This method is creating routes and is beginning listen server
 *
 * @returns {void}
 */
IW.Routes.prototype.init = function () {

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    this._control();

    app.use(express.static(this.PATH_APP));
    app.listen(this.config.port, this.config.host);
};

module.exports = IW;
