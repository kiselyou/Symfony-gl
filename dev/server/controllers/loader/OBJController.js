
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
        this._mtl = OBJController._prepareListMTL(MODELS_PATH);
    }

    /**
     * Upload objects
     *
     * @returns {void}
     */
    load() {

        this._getListModelsToLoad();

        let models = {};
        try {
            models['obj'] = this._server.fileLoader.getModels(this._objFiles);
            models['mtl'] = this._mtl;
        } catch (e) {
            console.log(e);
        }
        this._server.responseJSON(models);
    }

    _getListModelsToLoad() {
        let list = {};
        let load = this._server.parseData(this._server.POST['load']);
        let except = this._server.parseData(this._server.POST['except']);
        let namesLoad = OBJController._toArray(load);
        let namesExcept = OBJController._toArray(except);

        for (let key in this._objFiles) {
            if (this._objFiles.hasOwnProperty(key)) {

            }
        }
        console.log();
        console.log(OBJController._toArray(except));
    }

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