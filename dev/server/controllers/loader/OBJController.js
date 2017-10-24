
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
    }

	/**
	 * Get post data
	 *
	 * @param {string} key
	 * @returns {Array}
	 */
	post(key) {
    	return Object.values(this._server.parseData(this._server.POST[key]));
	}

	/**
	 * Upload all objects except specific
	 *
	 * @returns {void}
	 */
	loadAllObjects() {
		let list = OBJController.prepareList(Object.keys(MODELS_PATH), this.post('except'));
		this._server.responseJSON({
			obj: this._server.fileLoader.getModels(list['obj']),
			mtl: list['mtl']
		});
	}

    /**
     * Upload specific objects
     *
     * @returns {void}
     */
	loadSpecificObjects() {
        let list = OBJController.prepareList(this.post('load'));
		this._server.responseJSON({
			obj: this._server.fileLoader.getModels(list['obj']),
			mtl: list['mtl']
		});
    }

    /**
     * Prepare list of MTL paths
     *
     * @param {Array} data - The list of objects
	 * @param {Array} except
     * @returns {{mtl: Object, obj: Object}}
     * @static
     */
    static prepareList(data, except = []) {
        let list = {
			mtl: {},
			obj: {}
		};
        for (let name of data) {
        	if (except.indexOf(name) === -1) {
				let path = MODELS_PATH[name];
				list['obj'][name] = BASE_DIR_OBJ + path;
				list['mtl'][name] = BASE_DIR_OBJ + path.substr(0, path.lastIndexOf('.')) + '.mtl';
			}
        }
        return list;
    }
}

export default OBJController;