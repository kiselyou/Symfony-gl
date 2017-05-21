
require('array.prototype.find').shim();
var config = require(__dirname + '/server/config/config.json');
var IW = require('./server/core/Routes');
var route = new IW.Routes( config );

route
    .initSocket()
    .init();
