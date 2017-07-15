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
                    template = this.include(ch.html());
                } else {
                    template = this.include(pattern);
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
                    template = this.include(ch.html());
                } else {
                    template = this.include(pattern);
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
    include(content) {

        let template = cheerio.load(content);
        let str = this.extend(template);

        if (str) {
            return str;
        }

        template('[data-include]').each((key, element) => {

            let nameTemplate = template(element).attr('data-include');
            let path = this.getPathTemplate(this.conf.pathTemplates, nameTemplate);

            if (fs.existsSync(path)) {

                template(element).replaceWith(
                    this.include(fs.readFileSync(path, {encoding: this.conf.encoding}))
                );

            } else {
                new Error(null).warning('Template was not found in the path "' + path + '".', 'View', 'include');
            }
        });

        return template.html();
    };

    /**
     * Extend template
     *
     * @param {cheerio} template - It is template
     * @returns {?string}
     */
    extend(template) {
        template('[data-extend]').each((key, element) => {

            let el = template(element);
            let blockName = el.attr('data-extend-container');
            let nameTemplate = el.attr('data-extend');
            let path = this.getPathTemplate(this.conf.pathTemplates, nameTemplate);

            if (!blockName || !nameTemplate) {
                return new Error(null)
                    .warning('You mast set attribute "data-container=\"name-container\"" in the template "' + nameTemplate + '".', 'View', 'extend')
                    .get();
            }

            if (fs.existsSync(path)) {

                let extendTemplate = cheerio.load(fs.readFileSync(path, {encoding: this.conf.encoding}));
                extendTemplate('[data-extend-container="' + blockName + '"]').replaceWith(el.contents().children());
                let includeTemplate = this.include(extendTemplate.html());
                return el.replaceWith(includeTemplate).html();

            } else {
                new Error(null)
                    .warning('Template was not found in path: "' + path + '".', 'View', 'extend');
            }
        });

        return null;
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
