
function TemplateLoader( config ) {

    this._fs = require('fs');
    this._cheerio = require('cheerio');
    this._cheerio = require('cheerio');
}

/**
 *
 * @param {{}} res
 * @param {string} viewPath - It is path to html pattern
 * @returns {void}
 */
TemplateLoader.prototype.uploadPattern = function (res, viewPath) {
    var pathIndex = this.concatPath(DIR_APP, '/index.html');

    try {
        var indexHTML = this._fs.readFileSync(pathIndex);

        res.writeHead(200, {'Content-Type': 'text/html'});

        cache.scripts = [];
        cache.patterns = [];
        cache.build = null;

        if (!cache.build) {
            var $ = this._cheerio.load(indexHTML);
            $('body').prepend('<template data-include="' + viewPath + '"></template>');
            cache.build = this.loadScript(this.includePattern($.html(), true));
        }
        res.end(cache.build, config.encoding, true);

    } catch (error) {

        if (error.code === 'ENOENT') {
            this._fs.readFile(DIR_APP + '/404.html', function (error, content) {
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
    }
};

/**
 * Include template
 *
 * @param {string} content
 * @param {boolean} extend
 * @returns {*}
 */
TemplateLoader.prototype.includePattern = function (content, extend) {
    var path;
    var $ = this._cheerio.load(content);

    if(extend) {
        var str = this.extendPattern($);
        if (str) {
            return str;
        }
    }

    $('[data-include]').each(function() {
        var nameTemplate = $(this).attr('data-include');
        path = this.concatPath(PATH_TEMPLATES_HTML, nameTemplate);
        if (this._fs.existsSync(path)) {
            $(this).replaceWith(this.includePattern(this._fs.readFileSync(path, {encoding: config.encoding}), true));
            cache.patterns.push(nameTemplate);
        } else {
            console.log('Include: Template was not found in path ' + path);
        }
    });

    return $.html();
};

/**
 * Extend template
 *
 * @param {cheerio} $ the template
 * @returns {boolean|string}
 */
TemplateLoader.prototype.extendPattern = function ($) {
    $('[data-extend]').each(function () {

        var blockName = $(this).attr('data-block');

        if (!blockName) {
            console.log('Extend: The block was not found '  + blockName);
            return false;
        }

        var nameTemplate = $(this).attr('data-extend');
        path = this.concatPath(PATH_TEMPLATES_HTML, nameTemplate);

        if (this._fs.existsSync(path)) {

            var $$ = this._cheerio.load(this._fs.readFileSync(path, {encoding: config.encoding}));
            $$('[data-block="' + blockName + '"]').replaceWith($(this).children());
            $(this).replaceWith(this.includePattern($$.html(), true));
            cache.patterns.push(nameTemplate);
            return $.html();

        } else {
            console.log('Extend: Template was not found in path ' + path);
        }
    });

    return false;
};

/**
 *
 * @param {cheerio} $
 * @return {void}
 */
TemplateLoader.prototype.scriptsFilter = function ($) {
    $('script').each(function () {
        $('body:last-child').append($(this));
    });
};

/**
 *
 * @param {string} str
 * @return {string}
 */
TemplateLoader.prototype.loadScript = function (str) {
    var $ = this._cheerio.load(str);
    for (var i = 0; i < cache.patterns.length; i++) {
        var nameTemplateScript = cache.patterns[i].replace(/(\.html)$/, '.js');
        if (this._fs.existsSync(this.concatPath(PATH_TEMPLATES_JS, nameTemplateScript))) {
            var path = this.concatPath(this.concatPath(DIR_TEMPLATES, TEMPLATE_JS), nameTemplateScript);
            $('body:last-child').append('<script type="application/javascript" src="' + path.replace(/^(\/)/, '') + '"></script>');
            cache.scripts.push(nameTemplateScript);
        }
    }
    this.scriptsFilter($);
    return $.html();
};

/**
 *
 * @param {string} dir - possible value ( '/var/www/project/' | '/var/www/project/' )
 * @param {string} str - possible value ( '/path/to/file' )
 * @returns {string}
 */
TemplateLoader.prototype.concatPath = function (dir, str) {
    return dir.replace(/(\/)$/, '') + '/' + str.replace(/^(\/)/, '');
};

module.exports = TemplateLoader;
