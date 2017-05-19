
var MESSAGE_SERVER = 'Sorry, check with the site admin for error: ';

var fs = require('fs');
var cheerio = require('cheerio');
var config = require(__dirname + '/server/config/config.json');
var express = require('express');
var app = express();


// ADD TO CLASS REQUEST
var DIR_APP = getEnvironment(config);
var PATH_APP = __dirname + '/' + DIR_APP;

var TEMPLATE_JS = '/js';
var TEMPLATE_HTML = '/html';
var DIR_TEMPLATES = '/patterns';
var PATH_TEMPLATES = PATH_APP + DIR_TEMPLATES;
var PATH_TEMPLATES_JS = PATH_TEMPLATES + TEMPLATE_JS;
var PATH_TEMPLATES_HTML = PATH_TEMPLATES + TEMPLATE_HTML;

var DIR_ROUTES = '/server/routing';
var PATH_ROUTES = __dirname + DIR_ROUTES;

// CREATE CLASS CACHE
var cache = {
    scripts: [],
    patterns: [],
    build: null
};

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

fs.readdir(PATH_ROUTES, function (err, routes) {
    var routeConfig = [];
    for ( var i = 0; i < routes.length; i++ ) {
        var path = concatPath(PATH_ROUTES, routes[ i ]);
        routeConfig.push(require(path));
    }
});

// CREATE ROUTING CLASS
app.get('/', function (req, res) {
    var path = concatPath(DIR_APP, '/index.html');
    fs.readFile(path, null, function (error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile(DIR_APP + '/404.html', function (error, content) {
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


            cache.scripts = [];
            cache.patterns = [];
            cache.build = null;

            if (!cache.build) {
                cache.build = loadScript(includePattern(content));
            }
            res.end(cache.build, config.encoding, true);
        }
    });
});

app.get('/play', function (req, res) {
    console.log(req.query);
});

app.post('/template', function (req, res) {
    var path = concatPath(PATH_TEMPLATES_HTML, req.body['template']);
    fs.readFile(path, null, function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end(MESSAGE_SERVER + error.code + ' ..\n');
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(includePattern(content), config.encoding, true);
        }
    });
});

app.use(express.static(PATH_APP));

app.listen(config.port, config.host);

// CREATE CLASS PATTERN

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
function includePattern(content, extend) {
    var path;
    var $ = cheerio.load(content);

    if(extend) {
        var str = extendPattern($);
        if (str) {
            return str;
        }
    }

    $('[data-include]').each(function() {
        var nameTemplate = $(this).attr('data-include');
        path = concatPath(PATH_TEMPLATES_HTML, nameTemplate);
        if (fs.existsSync(path)) {
            $(this).replaceWith(includePattern(fs.readFileSync(path, {encoding: config.encoding}), true));
            cache.patterns.push(nameTemplate);
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
function extendPattern($) {
    $('[data-extend]').each(function () {

        var blockName = $(this).attr('data-block');

        if (!blockName) {
            console.log('Extend: The block was not found '  + blockName);
            return false;
        }

        var nameTemplate = $(this).attr('data-extend');
        path = concatPath(PATH_TEMPLATES_HTML, nameTemplate);

        if (fs.existsSync(path)) {

            var $$ = cheerio.load(fs.readFileSync(path, {encoding: config.encoding}));
            $$('[data-block="' + blockName + '"]').replaceWith($(this).children());
            $(this).replaceWith(includePattern($$.html(), true));
            cache.patterns.push(nameTemplate);
            return $.html();

        } else {
            console.log('Extend: Template was not found in path ' + path);
        }
    });

    return false;
}

/**
 *
 * @param {cheerio} $
 * @return {void}
 */
function scriptsFilter($) {
    $('script').each(function () {
        $('body:last-child').append($(this));
    });
}

/**
 *
 * @param {string} str
 * @return {string}
 */
function loadScript(str) {
    var $ = cheerio.load(str);
    for (var i = 0; i < cache.patterns.length; i++) {
        var nameTemplateScript = cache.patterns[i].replace(/(\.html)$/, '.js');
        if (fs.existsSync(concatPath(PATH_TEMPLATES_JS, nameTemplateScript))) {
            var path = concatPath(concatPath(DIR_TEMPLATES, TEMPLATE_JS), nameTemplateScript);
            $('body:last-child').append('<script type="application/javascript" src="' + path.replace(/^(\/)/, '') + '"></script>');
            cache.scripts.push(nameTemplateScript);
        }
    }
    scriptsFilter($);
    return $.html();
}

/**
 *
 * @param {string} dir - possible value ( '/var/www/project/' | '/var/www/project/' )
 * @param {string} str - possible value ( '/path/to/file' )
 * @returns {string}
 */
function concatPath(dir, str) {
    return dir.replace(/(\/)$/, '') + '/' + str.replace(/^(\/)/, '');
}
