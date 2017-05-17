
var MESSAGE_SERVER = 'Sorry, check with the site admin for error: ';

var fs = require('fs');
var cheerio = require('cheerio');
var config = require(__dirname + '/server/config/config.json');
var express = require('express');
var app = express();
var appDir = getEnvironment(config);

var DIR_ROUTES = __dirname + '/server/routing/';
var DIT_TEMPLATES =  __dirname + '/' + appDir + '/templates/';

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

fs.readdir(DIR_ROUTES, function (err, routes) {
    var routeConfig = [];
    for ( var i = 0; i < routes.length; i++ ) {
        routeConfig.push(require(DIR_ROUTES + routes[ i ]));
    }
});

app.get('/', function (req, res) {
    fs.readFile(appDir + '/index.html', null, function (error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile(appDir + '/404.html', function (error, content) {
                    if (error) {
                        res.writeHead(500);
                        res.end(MESSAGE_SERVER + error.code + ' ..\n');
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(content, config.encoding);
                    }
                });
            } else {
                res.writeHead(500);
                res.end(MESSAGE_SERVER + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(includeTemplate(content), config.encoding, true);
        }
    });
});

app.get('/play', function (req, res) {
    console.log(req.query);
});

app.post('/template', function (req, res) {
    fs.readFile(DIT_TEMPLATES + req.body['template'], null, function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end(MESSAGE_SERVER + error.code + ' ..\n');
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(includeTemplate(content), config.encoding, true);
        }
    });
});

app.use(express.static(__dirname + '/' + appDir));

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

/**
 * Include template
 *
 * @param {string} content
 * @param {boolean} extend
 * @returns {*}
 */
function includeTemplate(content, extend) {
    var path;
    var $ = cheerio.load(content);

    if(extend) {
        var str = extendTemplate($);
        if (str) {
            return str;
        }
    }

    $('[data-include]').each(function() {
        path = DIT_TEMPLATES + $(this).attr('data-include');
        if (fs.existsSync(path)) {
            $(this).replaceWith(includeTemplate(fs.readFileSync(path, {encoding: config.encoding}), true));
        } else {
            console.log('Include: Template was not found in path ' + path);
        }
    });

    return $.html();
}

/**
 * Extend template
 *
 * @param {cheerio} $ the template
 * @returns {boolean|string}
 */
function extendTemplate($) {
    $('[data-extend]').each(function () {

        var blockName = $(this).attr('data-block');

        if (!blockName) {
            console.log('Extend: The block was not found '  + blockName);
            return false;
        }

        path = DIT_TEMPLATES + $(this).attr('data-extend');

        if (fs.existsSync(path)) {

            var $$ = cheerio.load(fs.readFileSync(path, {encoding: config.encoding}));
            $$('[data-block="' + blockName + '"]').replaceWith($(this).children());
            $(this).replaceWith(includeTemplate($$.html(), true));
            return $.html();

        } else {
            console.log('Extend: Template was not found in path ' + path);
        }
    });

    return false;
}
