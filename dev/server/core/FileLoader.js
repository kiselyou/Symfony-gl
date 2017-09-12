import fs from 'fs';

import {
    BASE_DIR_OBJ
} from './../../js/ini/obj.ini';

import {
    BASE_DIR_VIEW
} from './../../js/ini/ejs-ini';

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

        /**
         *
         * @type {{}}
         * @private
         */
        this._models = {};
    }

    /**
     *
     * @returns {fs}
     */
    get fs() {
        return this._fs;
    }

    /**
     *
     * @param {string} path
     * @returns {string}
     */
    getModel(path) {
        return this._fs.readFileSync(BASE_DIR_OBJ + path, 'utf-8');
    }

    /**
     *
     * @param {Object} files
     * @returns {Object}
     */
    getModels(files) {
        let data = {};
        for (let key in files) {
            if (files.hasOwnProperty(key) && !this._models.hasOwnProperty(key)) {
                this._models[key] = this.getModel(files[key]);
            }
            if (this._models.hasOwnProperty(key)) {
                data[key] = this._models[key];
            }
        }
        return data;
    }

    /**
     * Get template
     *
     * @param {string} path
     * @returns {string}
     */
    getTemplate(path) {
        return this._fs.readFileSync(BASE_DIR_VIEW + path, 'utf-8');
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