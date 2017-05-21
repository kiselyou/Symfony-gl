var fs = require('fs');
var cheerio = require('cheerio');

var IW = require('./Request') || {};

IW.TemplateLoader = function ( config ) {
    IW.Request.call(this, config);

    /**
     * @type {{}}
     */
    this.config = config;

    var iw = require('./Cache');
    /**
     *
     * @type {IW.Cache}
     */
    this.ch = new iw.Cache(this.isDev());
};

/**
 *
 * @type {IW.Request}
 */
IW.TemplateLoader.prototype = Object.create(IW.Request.prototype);
IW.TemplateLoader.prototype.constructor = IW.TemplateLoader;

/**
 *
 * @type {(?|IW.Cache)}
 */
IW.TemplateLoader.prototype.ch = null;

/**
 *
 * @param {string} route - Ith is HTTP path
 * @param {string} viewPath - It is path to html pattern
 * @returns {{content: string, status: boolean, error: * }}
 */
IW.TemplateLoader.prototype.uploadPattern = function (route, viewPath) {

    var content = '';

    try {

        var view = this.ch.get(route, viewPath);

        if (view) {
            content = view;
        } else {
            var pathIndex = this.concatPath(this.DIR_APP, '/index.html');
            var indexHTML = fs.readFileSync(pathIndex);
            var $ = cheerio.load(indexHTML);
            $('body').prepend('<template data-include="' + viewPath + '"></template>');

            // Include additional templates
            var arrTemplates = [];
            var pattern = this.includePattern($.html(), arrTemplates);
            content = this.filter(pattern, arrTemplates);

            // Add template to cache
            this.ch.add(route, viewPath, content);
        }

        return {
            content: content,
            status: true,
            error: null
        };

    } catch (error) {

        return this.uploadPatternError(error);
    }
};

/**
 * Upload pattern error
 *
 * @param {(string|{code: number})} error
 * @returns {{content: string, status: boolean, error: * }}
 */
IW.TemplateLoader.prototype.uploadPatternError = function (error) {
    // Error load page - need write log to file
    console.log(error);

    try {

        var content = '';
        var view = this.ch.get('/404.html', '/pages/404.html');

        if (view) {
            content = view;
        } else {

            var pathIndex = this.concatPath(this.DIR_APP, '/index.html');
            var $ = cheerio.load(fs.readFileSync(pathIndex));
            $('body').html('<template data-include="/pages/404.html"></template>');
            content = this.includePattern($.html());

            // Add template to cache
            this.ch.add('/404.html', '/pages/404.html', content);
        }

        // Upload page error
        return {
            content: content,
            status: false,
            error: error
        };

    } catch ( e ) {
        // If can't upload page error
        console.log(e);
        var code = error.code ? error.code : '';

        return {
            content: IW.TemplateLoader.MESSAGE_ERROR + code + ' ..\n',
            status: false,
            error: error
        };
    }
};

/**
 * Include additional templates
 *
 * @param {string} content
 * @param {Array} [arrTemplates]
 * @returns {*}
 */
IW.TemplateLoader.prototype.includePattern = function (content, arrTemplates) {

    var scope = this;
    var $ = cheerio.load(content);
    var str = this.extendPattern($, arrTemplates);

    if (str) {
        return str;
    }

    $('[data-include]').each(function() {

        var nameTemplate = $(this).attr('data-include');
        var path = scope.concatPath(scope.PATH_TEMPLATES_HTML, nameTemplate);

        if (fs.existsSync(path)) {

            var str = fs.readFileSync(path, {encoding: scope.config.encoding});
            $(this).replaceWith(scope.includePattern(str, arrTemplates));

            scope.fillArray(arrTemplates, nameTemplate);

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
 * @param {Array} [arrTemplates]
 * @returns {boolean|string}
 */
IW.TemplateLoader.prototype.extendPattern = function ($, arrTemplates) {

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

            var $$ = cheerio.load(fs.readFileSync(path, {encoding: scope.config.encoding}));
            $$('[data-block="' + blockName + '"]').replaceWith($(this).children());
            $(this).replaceWith(scope.includePattern($$.html(), arrTemplates));

            scope.fillArray(arrTemplates, nameTemplate);

            return $.html();

        } else {

            console.log('Extend: Template was not found in path ' + path);
        }
    });

    return false;
};

/**
 *
 * @param {Array} arr
 * @param {string} value
 * @returns {void}
 */
IW.TemplateLoader.prototype.fillArray = function (arr, value) {
    if (typeof arr === 'object' && arr.indexOf(value) === -1) {
        arr.push(value);
    }
};

/**
 * This method is uploading additional scripts
 *
 * @param {string} pattern - It is uploaded pattern which has body element
 * @param {Array} arrTemplates - It is list included templates for which need find and upload scripts
 * @return {string}
 */
IW.TemplateLoader.prototype.filter = function (pattern, arrTemplates) {

    var $ = cheerio.load(pattern);

    for (var i = 0; i < arrTemplates.length; i++) {

        var nameTemplateScript = arrTemplates[i].replace(/(\.html)$/, '.js');

        if (fs.existsSync(this.concatPath(this.PATH_TEMPLATES_JS, nameTemplateScript))) {

            var path = this.concatPath(this.concatPath(IW.Request.DIR_TEMPLATES, IW.Request.TEMPLATE_JS), nameTemplateScript);
            $('body:last-child').append('<script type="application/javascript" src="' + path.replace(/^(\/)/, '') + '"></script>');
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
