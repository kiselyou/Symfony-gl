const fs = require('fs');
const cheerio = require('cheerio');
const Cache = require('./Cache');
const Error = require('./../Error');

const HTML_404 = '/404.html';
const HTML_INDEX = '/index.html';

class View {

    /**
     *
     * @param {Components} config
     */
    constructor(config) {

        /**
         *
         * @type {Components}
         */
        this.conf = config;

        /**
         *
         * @type {Cache}
         */
        this.ch = new Cache(this.conf.isDev());
    }

    /**
     *
     * @param path
     * @returns {string}
     */
    createPattern(path) {
        return '<template data-include="' + path + '"></template>';
    };

    /**
     *
     * @param {string} route - Ith is HTTP path
     * @param {string} viewPath - It is path to html pattern
     * @returns {{content: string, status: boolean, error: * }}
     */
    prepareTemplate(route, viewPath) {

        let content = '';

        try {

            let view = this.ch.get(route, viewPath);

            if (view) {

                content = view;

            } else {

                let pathIndex = this.getPathTemplate(this.conf.pathEnvironment, HTML_INDEX);
                let indexHTML = fs.readFileSync(pathIndex);
                let $ = cheerio.load(indexHTML);
                $('body').prepend(this.createPattern(viewPath));

                // Include additional templates
                content = this.includePattern($.html(), []);

                // Add template to cache
                this.ch.add(route, viewPath, content);
            }

            return {
                content: content,
                status: true,
                error: null
            };

        } catch (error) {
            return this.prepareTemplateError(error);
        }
    };

    /**
     * Upload pattern error
     *
     * @param {(string|{code: number})} error
     * @returns {{content: string, status: boolean, error: * }}
     */
    prepareTemplateError(error) {

        try {

            let content = '',
                view = this.ch.get(HTML_404, HTML_404);

            if (view) {
                content = view;
            } else {

                let pathIndex = this.getPathTemplate(this.conf.pathEnvironment, HTML_INDEX);
                let ch = cheerio.load(fs.readFileSync(pathIndex));
                ch('body').html(this.createPattern(HTML_404));
                content = this.includePattern(ch.html(), []);
                this.ch.add(HTML_404, HTML_404, content);
            }

            return {
                content: content,
                status: false,
                error: error
            };

        } catch ( e ) {
            let msg = 'Sorry, check with the site admin for error:' + e.code + '. View.prepareTemplateError()';
            new Error(e).message(msg);
            return {
                content: msg,
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
    includePattern(content, arrTemplates) {

        let scope = this;
        let ch = cheerio.load(content);
        let str = this.extendPattern(ch, arrTemplates);

        if (str) {
            return str;
        }

        ch('[data-include]').each(function() {

            let nameTemplate = ch(this).attr('data-include');
            let path = scope.getPathTemplate(scope.conf.pathTemplates, nameTemplate);

            if (fs.existsSync(path)) {

                ch(this).replaceWith(
                    scope.includePattern(
                        fs.readFileSync(path, {encoding: scope.conf.encoding}),
                        arrTemplates
                    )
                );

                scope.fillArray(arrTemplates, nameTemplate);

            } else {
                new Error(null).message('Include: Template was not found in the path "' + path + '". View.includePattern()');
            }
        });

        return ch.html();
    };

    /**
     * Extend template
     *
     * @param {cheerio} ch the template
     * @param {Array} [arrTemplates]
     * @returns {boolean|string}
     */
    extendPattern(ch, arrTemplates) {

        let scope = this;
        ch('[data-extend]').each(function () {

            let blockName = ch(this).attr('data-extend-container');
            let nameTemplate = ch(this).attr('data-extend');
            let path = scope.getPathTemplate(scope.conf.pathTemplates, nameTemplate);

            if (!blockName || !nameTemplate) {
                new Error(null).message('Extend: You mast set attribute "data-container=\"name-container\"" in the template "' + nameTemplate + '". View.extendPattern()');
                return false;
            }

            if (fs.existsSync(path)) {

                let $$ = cheerio.load(fs.readFileSync(path, {encoding: scope.conf.encoding}));
                $$('[data-extend-container="' + blockName + '"]').replaceWith(ch(this).children());
                ch(this).replaceWith(scope.includePattern($$.html(), arrTemplates));

                scope.fillArray(arrTemplates, nameTemplate);

                return ch.html();

            } else {
                new Error(null).message('Extend: Template was not found in path: "' + path + '". View.extendPattern()');
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
    fillArray(arr, value) {
        if (typeof arr === 'object' && arr.indexOf(value) === -1) {
            arr.push(value);
        }
    };

    /**
     *
     * @param {string} dir
     * @param {string} file
     * @returns {string}
     */
    getPathTemplate(dir, file) {
        return this.conf.routes.joinPath(__dirname, this.conf.routes.joinPath('./../../../' + dir, file));
    }
}

/**
 *
 * @module View
 */
module.exports = View;
