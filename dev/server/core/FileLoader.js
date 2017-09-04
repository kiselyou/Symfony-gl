import fs from 'fs';

class FileLoader {

    constructor() {
        /**
         * @type {fs}
         */
        this.fs = fs;
    }

    /**
     * Get template
     *
     * @param {string} path
     * @returns {string}
     */
    getTemplate(path) {
        return this.fs.readFileSync('views/' + path, 'utf-8');
    }
}

export default FileLoader;