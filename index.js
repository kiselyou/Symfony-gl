
var MESSAGE_SERVER = 'Sorry, check with the site admin for error: ';
var DIR_ROUTES = __dirname + '/server/routing/';

var fs = require('fs');
var cheerio = require('cheerio');
var config = require(__dirname + '/server/config/config.json');
var express = require('express');
var app = express();
var appDir = getEnvironment(config);

app.use(express.static(__dirname + '/' + appDir + '/'));

fs.readdir(DIR_ROUTES, function (err, routes) {
    var routeConfig = [];
    for ( var i = 0; i < routes.length; i++ ) {
        routeConfig.push(require(DIR_ROUTES + routes[ i ]));
    }
});

app.get('/', function (req, res) {
    fs.readFile(appDir + '/index.html', function (error, content) {
        console.log(error, content);
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile(appDir + '/404.html', function (error, content) {
                    if (error) {
                        res.writeHead(500);
                        res.end(MESSAGE_SERVER + error.code + ' ..\n');
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(content, config.charset);
                    }
                });
            } else {
                res.writeHead(500);
                res.end(MESSAGE_SERVER + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content, config.charset);
        }
    });
});

app.listen(config.port, config.host);

/**
 * Get directory of environment
 *
 * @param {{environment: {app: boolean, dist: boolean}}} config
 * @returns {string} possible values ( 'app' | 'dist' )
 */
function getEnvironment(config) {
    for ( var environment in config.environment ) {
        if (config.environment.hasOwnProperty(environment) && config.environment[environment]) {
            return environment;
        }
    }
    return 'app';
}
