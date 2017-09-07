import fs from 'fs';

class FileLoader {

    constructor() {
        /**
         * @type {fs}
         */
        this._fs = fs;

        /**
         *
         * @type {{}}
         * @private
         */
        this._templates = {};
    }

    /**
     *
     * @returns {fs}
     */
    get fs() {
        return this._fs;
    }

    /**
     * Get template
     *
     * @param {string} path
     * @returns {string}
     */
    getTemplate(path) {
        return this._fs.readFileSync('views/' + path, 'utf-8');
    }

    /**
     * Get templates
     *
     * @param {Object} files
     * @returns {Object}
     */
    getTemplates(files) {
        for (let key in files) {
            if (files.hasOwnProperty(key)) {
                this._templates[key] = this.getTemplate(files[key]);
            }
        }
        return this._templates;
    }
}

export default FileLoader;