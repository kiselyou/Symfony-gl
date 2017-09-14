
import {
    MODELS_PATH,
    BASE_DIR_OBJ
} from './../../../js/ini/obj.ini';

class OBJController {
    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;
        this._objFiles = MODELS_PATH;
    }

    /**
     * Upload objects
     *
     * @returns {void}
     */
    load() {
        let models = {};
        try {
            let load = this._server.parseData(this._server.POST['load']);
            let except = this._server.parseData(this._server.POST['except']);
            let listModels = this._getListModelsToLoad(load, except);
            models['obj'] = this._server.fileLoader.getModels(listModels);
            models['mtl'] = OBJController._prepareListMTL(listModels);
        } catch (e) {
            console.log(e);
        }
        this._server.responseJSON(models);
    }

    /**
     * Get List models for load
     *
     * @param {Array|Object} load - List models to load from POST data
     * @param {Array|Object} except - List models witch need exclude from POST data
     * @returns {*}
     * @private
     */
    _getListModelsToLoad(load, except) {
        let list = {};
        let namesLoad = OBJController._toArray(load);
        if (namesLoad.length > 0) {
            for (let name of namesLoad) {
                if (this._objFiles.hasOwnProperty(name)) {
                    list[name] = this._objFiles[name];
                }
            }
        } else {
            list = this._objFiles;
        }

        return OBJController._excludeModelsFromList(list, except);
    }

    /**
     * Exclude models from load
     *
     * @param {Object} list - List models to load
     * @param {Array|Object} except - List models witch need exclude
     * @returns {*}
     * @private
     */
    static _excludeModelsFromList(list, except) {
        let namesExcept = OBJController._toArray(except);
        if (namesExcept.length > 0) {
            for (let name of namesExcept) {
                if (list.hasOwnProperty(name)) {
                    delete list[name];
                }
            }
        }
        return list;
    }

    /**
     *
     * @param {Object} data
     * @returns {Array}
     * @private
     */
    static _toArray(data) {
        let arr = [];
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                arr.push(data[key]);
            }
        }
        return arr;
    }

    /**
     * Prepare list of MTL files
     *
     * @param {Object} data - The list of objects
     * @returns {{}}
     * @static
     * @private
     */
    static _prepareListMTL(data) {
        let list = {};
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let file = data[key];
                list[key] = BASE_DIR_OBJ + file.substr(0, file.lastIndexOf('.')) + '.mtl';
            }
        }
        return list;
    }
}

export default OBJController;