
require('array.prototype.find').shim();
/**
 * @type {{ encoding: string, server: *, socket: * routes: * }}
 */
var config = require(__dirname + '/server/config/config.json');
var IW = require('./server/core/Routes');
var route = new IW.Routes( config );

route
    .initSocket( config.socket )
    .init();
