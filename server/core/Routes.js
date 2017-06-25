var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Security = require('./Security');
var ioSocket = require('./Socket.js') || {};
var IW = require('./TemplateLoader') || {};

IW.Routes = function ( config ) {
    IW.TemplateLoader.call(this, config);
    this.security = new Security(config);
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
        scope.createRoute( this.routes[i] );
    }

    // // Setting route to load templates
    // app.all('/template', function(req, res) {
    //
    //     try {
    //
    //         var arrTemplates = [];
    //
    //         scope.response(
    //             req,
    //             res,
    //             {
    //                 content: scope.includePattern('<template data-include="' + req.body['path'] + '"></template>', arrTemplates),
    //                 status: true,
    //                 error: null
    //             }
    //         );
    //
    //     } catch (error) {
    //
    //         scope.response( req, res, scope.prepareTemplateError(error) );
    //     }
    // });

    app.use('/app/', express.static(this.joinPath(__dirname, '/../../' + this.DIR_APP)));

    // Setting route error
    app.get( '*', function( req, res ) {
        scope.response( req, res, scope.prepareTemplateError( 'The page "' + req.url + '" was not found') );
    });

};

var USER_ROLE_TEST = 'ROLE_IW';

IW.Routes.prototype.createRoute = function ( params ) {

    var scope = this;

    switch ( params['method'] ) {
        case 'POST':
            app.post( params[ 'route' ], function ( req, res ) {
                scope.sendResponse(req, res, params);
            });
            break;
        case 'GET':
            app.get( params[ 'route' ], function ( req, res ) {
                scope.sendResponse(req, res, params);
            });
            break;
        default:
            app.all( params[ 'route' ], function ( req, res ) {
                scope.sendResponse(req, res, params);
            });
            break;
    }
};

IW.Routes.prototype.sendResponse = function ( req, res, params ) {
    if (this.security.isGranted(req.url, USER_ROLE_TEST)) {
        if (params.hasOwnProperty('viewPath')) {
            // Upload template and send it like response
            this.response(req, res, this.prepareTemplate(params['route'], params['viewPath']));
        } else {
            // Call to controller and send his response
            this.callToController(req, res, params);
        }
    } else {
        this.response(req, res, this.prepareTemplateError('Permission Denied the page "' + req.url + '"') );
    }
};

/**
 * Call to controller
 *
 * @param {{}} req
 * @param {{}} res
 * @param params
 * @returns {void}
 */
IW.Routes.prototype.callToController = function (req, res, params) {

    // 0 - module, 1 - name of controller 2 - method
    var data = params['controller'].split(':');

    if (data.length !== 3) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('Route configuration is not correct');
        return;
    }

    var path = data[0] + '/' + data[1] + '.js';
    var pathController = this.joinPath('./../controller/', path);
    var method = data[2];

    try {
        var Controller = require(this.joinPath(__dirname, pathController));
        var object = new Controller(this.config);
        object[method](req, res);
    } catch (e) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('Route configuration is not correct. Method "' + method + '" dose not exist in the controller "' + path + '" Error:' + e.message);
    }
};

/**
 * Send response to client
 *
 * @param {{}} req
 * @param {{}} res
 * @param {{ status: boolean, content: string, error: string }} pattern
 */
IW.Routes.prototype.response = function ( req, res, pattern ) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(pattern.content, this.config.encoding, true);
};

/**
 *
 * @param {{ port: number, host: string }} config
 * @returns {IW.Routes}
 */
IW.Routes.prototype.initSocket = function ( config ) {
    var socket = new ioSocket.Socket( app, config );
    socket.listen( 'play' );
    return this;
};

/**
 * This method is creating routes and is beginning listen server
 *
 * @returns {IW.Routes}
 */
IW.Routes.prototype.init = function () {

    app.use( bodyParser.urlencoded( { extended: true } ) );
    app.use( bodyParser.json() );

    this._control();

    app.listen( this.config.server.port, this.config.server.host );
    return this;
};

module.exports = IW;
