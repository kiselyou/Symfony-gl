import fs from 'fs';

class FileLoader {

    constructor() {
        /**
         * @type {fs}
         */
        this._fs = fs;
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
}

export default FileLoader;