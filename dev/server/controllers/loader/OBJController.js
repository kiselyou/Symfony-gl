
import {
    MODELS_PATH
} from './../../../js/ini/obj.ini';

class OBJController {
    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;
        this._listObj = MODELS_PATH;
        this._listMTL = OBJController._prepareListMTL(MODELS_PATH);
    }

    /**
     * Upload objects
     *
     * @returns {void}
     */
    load() {
        let models = {};
        try {
            models['obj'] = this._server.fileLoader.getModels(this._listObj);
            models['mtl'] = this._listMTL;
        } catch (e) {
            console.log(e);
        }
        this._server.responseJSON(models);
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
                list[key] = file.substr(0, file.lastIndexOf('.')) + '.mtl';
            }
        }
        return list;
    }
}

export default OBJController;