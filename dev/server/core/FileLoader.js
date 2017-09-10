import fs from 'fs';

import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

class FileLoader {

    constructor() {
        /**
         * @type {fs}
         */
        this._fs = fs;

        /**
         *
         * @type {THREE.OBJLoader}
         * @private
         */
        this._OBJLoader = new THREE.OBJLoader();

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
        let model = this._fs.readFileSync('models/' + path, 'utf-8');
        return this._OBJLoader.parse(model).toJSON();
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