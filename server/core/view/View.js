const fs = require('fs');
const cheerio = require('cheerio');
const Cache = require('./Cache');
const Error = require('./../Error');

const HTML_404 = '/404.html';
const HTML_INDEX = '/index.html';

class View {

    /**
     *
     * @param {Conf} config
     * @param {Routes} routes
     */
    constructor(config, routes) {

        /**
         *
         * @type {Conf}
         */
        this.conf = config;

        /**
         *
         * @type {Routes}
         */
        this.routes = routes;

        /**
         *
         * @type {Cache}
         */
        this.ch = new Cache(this.conf.isDev());
    }

    /**
     *
     * @param {string} path
     * @returns {string}
     */
    static createPattern(path) {
        return '<template data-include="' + path + '"></template>';
    };

    /**
     *
     * @param {string} route - Ith is HTTP path
     * @param {string} viewPath - It is path to html pattern
     * @param {boolean} [full]
     * @returns {string}
     */
    prepareTemplate(route, viewPath, full) {

        let template = '';

        try {

            let view = this.ch.get(route, viewPath);

            if (view) {

                template = view;

            } else {

                let pattern = View.createPattern(viewPath);

                if (full) {
                    let pathIndexHTML = this.getPathTemplate(this.conf.pathEnvironment, HTML_INDEX);
                    let indexHTML = fs.readFileSync(pathIndexHTML);
                    let ch = cheerio.load(indexHTML);
                    ch('body').prepend(pattern);
                    template = this.includePattern(ch.html());
                } else {
                    template = this.includePattern(pattern);
                }

                this.ch.add(route, viewPath, template);
            }

            return template;

        } catch (e) {
            new Error(e).alert('Cannot prepare template.', 'View', 'prepareTemplate');
            return this.prepareTemplateError(true);
        }
    };

    /**
     * Upload pattern error
     *
     * @param {boolean} [full]
     * @returns {string}
     */
    prepareTemplateError(full) {
        try {
            let prefix = full ? '_full' : '_simple';
            let template = '',
                view = this.ch.get(HTML_404 + prefix, HTML_404 + prefix);

            if (view) {

                template = view;

            } else {

                let pattern = View.createPattern(HTML_404);

                if (full) {
                    let pathIndex = this.getPathTemplate(this.conf.pathEnvironment, HTML_INDEX);
                    let ch = cheerio.load(fs.readFileSync(pathIndex));
                    ch('body').html(pattern);
                    template = this.includePattern(ch.html());
                } else {
                    template = this.includePattern(pattern);
                }

                this.ch.add(HTML_404 + prefix, HTML_404 + prefix, template);

            }

            return template;

        } catch (e) {

            return new Error(e).alert('Cannot prepare template.', 'View', 'prepareTemplateError').get();
        }
    };

    /**
     * Include additional templates
     *
     * @param {string} content
     * @returns {*}
     */
    includePattern(content) {

        let scope = this;
        let ch = cheerio.load(content);
        let str = this.extendPattern(ch);

        if (str) {
            return str;
        }

        ch('[data-include]').each((key, element) => {

            let nameTemplate = ch(element).attr('data-include');
            let path = scope.getPathTemplate(scope.conf.pathTemplates, nameTemplate);

            if (fs.existsSync(path)) {

                ch(element).replaceWith(
                    scope.includePattern(fs.readFileSync(path, {encoding: scope.conf.encoding}))
                );

            } else {
                new Error(null).warning('Template was not found in the path "' + path + '".', 'View', 'includePattern');
            }
        });

        return ch.html();
    };

    /**
     * Extend template
     *
     * @param {cheerio} ch - It is template
     * @returns {boolean|string}
     */
    extendPattern(ch) {

        let scope = this;
        ch('[data-extend]').each((key, element) => {

            let blockName = ch(element).attr('data-extend-container');
            let nameTemplate = ch(element).attr('data-extend');
            let path = scope.getPathTemplate(scope.conf.pathTemplates, nameTemplate);

            if (!blockName || !nameTemplate) {
                return new Error(null)
                    .warning('You mast set attribute "data-container=\"name-container\"" in the template "' + nameTemplate + '".', 'View', 'extendPattern')
                    .get();
            }

            if (fs.existsSync(path)) {

                let $$ = cheerio.load(fs.readFileSync(path, {encoding: scope.conf.encoding}));
                $$('[data-extend-container="' + blockName + '"]').replaceWith(ch(element).children());
                ch(element).replaceWith(scope.includePattern($$.html()));
                return ch.html();

            } else {
                new Error(null)
                    .warning('Template was not found in path: "' + path + '".', 'View', 'extendPattern');
            }
        });

        return false;
    };

    /**
     *
     * @param {string} dir
     * @param {string} file
     * @returns {string}
     */
    getPathTemplate(dir, file) {
        return this.routes.joinPath(__dirname, this.routes.joinPath('./../../../' + dir, file));
    }
}

/**
 *
 * @module View
 */
module.exports = View;
