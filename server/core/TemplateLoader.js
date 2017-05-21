var fs = require('fs');
var cheerio = require('cheerio');

var IW = require('./Request') || {};

IW.TemplateLoader = function ( config ) {
    IW.Request.call(this, config);

    /**
     * @type {{}}
     */
    this.config = config;

    this.cache = {
        scripts: [],
        patterns: [],
        build: []
    };
};

/**
 *
 * @type {IW.Request}
 */
IW.TemplateLoader.prototype = Object.create(IW.Request.prototype);
IW.TemplateLoader.prototype.constructor = IW.TemplateLoader;

/**
 *
 * @param {{}} res
 * @param {string} viewPath - It is path to html pattern
 * @returns {{content: string, status: boolean, error: * }}
 */
IW.TemplateLoader.prototype.uploadPattern = function (res, viewPath) {

    var pathIndex = this.concatPath(this.DIR_APP, '/index.html');

    try {

        var indexHTML = fs.readFileSync(pathIndex);
        var $ = cheerio.load(indexHTML);
        $('body').prepend('<template data-include="' + viewPath + '"></template>');

        return {
            content: this.loadScript(this.includePattern($.html(), true)),
            status: true,
            error: null
        };

    } catch (error) {

        try {

            return {
                content: fs.readFileSync(this.DIR_APP + '/404.html'),
                status: false,
                error: error
            };

        } catch ( e ) {

            return {
                content: IW.TemplateLoader.MESSAGE_ERROR + error.code + ' ..\n',
                status: false,
                error: error
            };
        }
    }
};

/**
 * Include templates
 *
 * @param {string} content
 * @param {boolean} extend
 * @returns {*}
 */
IW.TemplateLoader.prototype.includePattern = function (content, extend) {
    var scope = this;
    var $ = cheerio.load(content);

    if(extend) {
        var str = this.extendPattern($);
        if (str) {
            return str;
        }
    }

    $('[data-include]').each(function() {
        var nameTemplate = $(this).attr('data-include');
        var path = scope.concatPath(scope.PATH_TEMPLATES_HTML, nameTemplate);
        if (fs.existsSync(path)) {
            $(this).replaceWith(scope.includePattern(fs.readFileSync(path, {encoding: scope.config.encoding}), true));
            scope.cache.patterns.push(nameTemplate);
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
IW.TemplateLoader.prototype.extendPattern = function ($) {

    var scope = this;

    $('[data-extend]').each(function () {

        var blockName = $(this).attr('data-block');
        var nameTemplate = $(this).attr('data-extend');
        var path = scope.concatPath(scope.PATH_TEMPLATES_HTML, nameTemplate);

        if (!blockName) {
            console.log('Extend: The block was not found '  + blockName);
            return false;
        }

        if (fs.existsSync(path)) {

            var str = fs.readFileSync(path, {encoding: scope.config.encoding});
            var $$ = cheerio.load(str);
            $$('[data-block="' + blockName + '"]').replaceWith($(this).children());
            $(this).replaceWith(scope.includePattern($$.html(), true));
            scope.cache.patterns.push(nameTemplate);
            return $.html();

        } else {

            console.log('Extend: Template was not found in path ' + path);
        }
    });

    return false;
};

/**
 * This method is uploading additional scripts
 *
 * @param {string} str
 * @return {string}
 */
IW.TemplateLoader.prototype.loadScript = function (str) {

    var $ = cheerio.load(str);

    for (var i = 0; i < this.cache.patterns.length; i++) {

        var nameTemplateScript = this.cache.patterns[i].replace(/(\.html)$/, '.js');

        if (fs.existsSync(this.concatPath(this.PATH_TEMPLATES_JS, nameTemplateScript))) {

            var path = this.concatPath(this.concatPath(IW.Request.DIR_TEMPLATES, IW.Request.TEMPLATE_JS), nameTemplateScript);
            $('body:last-child').append('<script type="application/javascript" src="' + path.replace(/^(\/)/, '') + '"></script>');
            this.cache.scripts.push(nameTemplateScript);
        }
    }

    this.moveScripts($);

    return $.html();
};

/**
 * Move scripts to end body of main template
 *
 * @param {cheerio} $
 * @return {void}
 */
IW.TemplateLoader.prototype.moveScripts = function ($) {
    $('script').each(function () {
        $('body:last-child').append($(this));
    });
};

IW.TemplateLoader.MESSAGE_ERROR = 'Sorry, check with the site admin for error: ';

module.exports = IW;
