
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var io = require('./Socket.js') || {};
var IW = require('./TemplateLoader') || {};

IW.Routes = function ( config ) {
    IW.TemplateLoader.call(this, config);
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
    var scope = this;
    // Upload configured routes
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

    // Setting route to load templates
    app.all(scope.config.routes.templates, function(req, res) {

        try {

            var arrTemplates = [];

            scope.response(
                res,
                {
                    content: scope.includePattern('<template data-include="' + req.body['template'] + '"></template>', arrTemplates),
                    status: true,
                    error: null
                }
            );

        } catch (error) {

            scope.response( res, scope.uploadPatternError(error) );
        }
    });

    // Setting public directory
    app.use(express.static(this.DIR_APP));

    // Setting route error
    app.get('*', function(req, res) {
        scope.response(res, scope.uploadPatternError('The page was not found in GET path: "' + req.url + '"'));
    });
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
                scope.response(res, scope.uploadPattern(route, viewPath));
            });
            break;
        case 'GET':
            app.get(route, function (req, res) {
                scope.response(res, scope.uploadPattern(route, viewPath));
            });
            break;
        default:
            app.all(route, function (req, res) {
                scope.response(res, scope.uploadPattern(route, viewPath));
            });
            break;
    }
};

/**
 * Send response to client
 *
 * @param {{}} res
 * @param {{ status: boolean, content: string, error: string }} pattern
 */
IW.Routes.prototype.response = function (res, pattern) {
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
 *
 * @returns {IW.Routes}
 */
IW.Routes.prototype.initSocket = function () {
    var socket = new io.Socket(app);
    socket.listen('play');
    return this;
};

/**
 * This method is creating routes and is beginning listen server
 *
 * @returns {IW.Routes}
 */
IW.Routes.prototype.init = function () {

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    this._control();

    app.listen(this.config.port, this.config.host);
    return this;
};

module.exports = IW;
