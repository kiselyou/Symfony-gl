var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var ioSocket = require('./Socket.js') || {};
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

        scope.createRoute( this.routes[i] );

        // /**
        //  *
        //  * @type {{type: string, route: string, method: string, viewPath: string }}
        //  */
        // var route = this.routes[i];
        // switch (route['type']) {
        //     case 'pattern':
        //         this.createRoute(route['route'], route['method'], route['viewPath']);
        //         break;
        //
        //     case 'ajax':
        //
        // }
    }

    // Setting route to load templates
    app.all('/template', function(req, res) {

        try {

            var arrTemplates = [];

            scope.responseHTML(
                res,
                {
                    content: scope.includePattern('<template data-include="' + req.body['path'] + '"></template>', arrTemplates),
                    status: true,
                    error: null
                }
            );

        } catch (error) {

            scope.responseHTML( res, scope.uploadPatternError(error) );
        }
    });

    app.use('/app/', express.static(this.joinPath(__dirname, '/../../' + this.DIR_APP)));

    // Setting route error
    app.get( '*', function( req, res ) {
        // console.log(req.url);
        // console.log(req.baseUrl);
        scope.responseHTML( res, scope.uploadPatternError( 'The page "' + req.url + '" was not found') );
    });

};

// /**
//  * Create route
//  *
//  * @param {string} route - It is HTTP route
//  * @param {method} method - possible values ( 'GET' | 'POST' )
//  * @param {string} viewPath - It is path to html pattern
//  * @returns {void}
//  */
// IW.Routes.prototype.createRoute = function (route, method, viewPath) {
//     var scope = this;
//     switch (method) {
//         case 'POST':
//             console.log(route);
//             app.post(route, function (req, res) {
//                 scope.responseHTML(res, scope.uploadPattern(route, viewPath));
//             });
//             break;
//         case 'GET':
//             app.get(route, function (req, res) {
//                 scope.responseHTML(res, scope.uploadPattern(route, viewPath));
//             });
//             break;
//         default:
//             app.all(route, function (req, res) {
//                 scope.responseHTML(res, scope.uploadPattern(route, viewPath));
//             });
//             break;
//     }
// };

/**
 * Create route
 *
 * @param {{ method: string, route: string, viewPath: string }} params
 * @example explain:
 *              route - It is HTTP route
 *              method - possible values ( 'GET' | 'POST' )
 *              viewPath - It is path to html pattern
 * @returns {void}
 */
IW.Routes.prototype.createRouteTemplate = function ( params ) {
    var scope = this;
    switch ( params['method'] ) {
        case 'POST':
            app.post( params[ 'route' ], function ( req, res ) {
                scope.responseHTML( res, scope.uploadPattern( params[ 'route' ], params[ 'viewPath' ] ) );
            } );
            break;
        case 'GET':
            app.get( params[ 'route' ], function ( req, res ) {
                scope.responseHTML( res, scope.uploadPattern( params[ 'route' ], params[ 'viewPath' ] ) );
            } );
            break;
        default:
            app.all( params[ 'route' ], function ( req, res ) {
                scope.responseHTML( res, scope.uploadPattern( params[ 'route' ], params[ 'viewPath' ] ) );
            } );
            break;
    }
};


IW.Routes.prototype.createRouteAJAX = function ( params ) {
    var scope = this;
    switch ( params['method'] ) {
        case 'POST':
            app.post( params[ 'route' ], function ( req, res ) {
                scope.responseAJAX( res, scope.callToController( params ) );
            } );
            break;
        case 'GET':
            app.get( params[ 'route' ], function ( req, res ) {
                scope.responseAJAX( res, scope.callToController( params ) );
            } );
            break;
        default:
            app.all( params[ 'route' ], function ( req, res ) {
                scope.responseAJAX( res, scope.callToController( params ) );
            } );
            break;
    }
};

IW.Routes.prototype.createRoute = function ( params ) {

    switch ( params[ 'type' ] ) {
        case 'pattern':
            this.createRouteTemplate( params );
            break;
        case 'ajax':
            this.createRouteAJAX( params );
            break;
    }
};

/**
 * Call to controller
 *
 * @param params
 * @returns {{}}
 */
IW.Routes.prototype.callToController = function ( params ) {
    return {
        config: {
            socket: this.config.socket.host + ':' + this.config.socket.port + '/play'
        }
    };
};

/**
 * Send response to client
 *
 * @param {{}} res
 * @param {{ status: boolean, content: string, error: string }} pattern
 */
IW.Routes.prototype.responseHTML = function ( res, pattern ) {
    // console.log(pattern);
    if ( pattern.status ) {
        res.writeHead( 200, { 'Content-Type': 'text/html' } );
        res.end( pattern.content, this.config.encoding, true );
    } else {
        res.writeHead( 500 );
        res.end( pattern.content );
        console.log( pattern.error );
    }
};

/**
 * Send response to client
 *
 * @param res
 * @param {{}} params
 */
IW.Routes.prototype.responseAJAX = function ( res, params ) {

    try {
        var json = JSON.stringify(params);
        res.writeHead(200, { 'Content-Type': 'application/json' } );
        res.end( json );

    } catch ( e ) {

        res.writeHead( 500, { 'Content-Type': 'application/json' } );
        res.end( JSON.stringify( { error: 'The server error: method (responseAJAX)' } ) );
        console.log( e.message );
    }
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
