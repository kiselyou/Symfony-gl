import * as THREE from 'three';
import Ajax from './../../system/Ajax';
import ProgressAjax from './../../system/progress/ProgressAjax';
import UIMessage from './../../system/ui/UIMessage';
import MTLLoader from './MTLLoader';
import OBJLoader from './OBJLoader';

let loader = null;

class Loader {
    constructor() {

        /**
         *
         * @type {LoadingManager}
         */
        this._manager = new THREE.LoadingManager();

        /**
         *
         * @type {MTLLoader}
         * @private
         */
        this._mtl = new MTLLoader(this._manager);

        /**
         *
         * @type {OBJLoader}
         * @private
         */
        this._obj = new OBJLoader(this._manager);

        /**
         * List loaded models
         *
         * @type {Object.<{string: Mesh|Group}>}
         * @private
         */
        this._listModels = {};

        /**
         * Names of loaded models
         *
         * @type {Array}
         * @private
         */
        this._keysModels = [];

        /**
         * Events after load
         *
         * @type {?loadCompleted}
         * @private
         */
        this._loadListener = null;

        /**
         * The key of model which is loading at the moment
         *
         * @type {number}
         * @private
         */
        this._currentTempKey = 0;

        /**
         * The models names which need to load MTL files after getting response from server
         *
         * @type {Array}
         * @private
         */
        this._tempNames = [];

        /**
         *
         * @type {Ajax}
         * @private
         */
        this._ajax = new Ajax();

        /**
         *
         * @type {UIMessage}
         * @private
         */
        this._msg = new UIMessage();

        this._iniManager();
    }

    /**
     * Initialisation events and progress bar
     *
     * @returns {void}
     * @private
     */
    _iniManager() {
        this._manager.onStart = () => {
            ProgressAjax.get().start();
        };

        this._manager.onProgress = (url, loaded, total) => {
            ProgressAjax.get().updateProgress(total, loaded);
        };

        this._manager.onLoad = () => {
            ProgressAjax.get().stop();
        };
    }

    /**
     *
     * @returns {Loader}
     */
    static get() {
        return loader || (loader = new Loader());
    }

    /**
     * Get model by name
     *
     * @param {string} name - This is specific model's name
     * @returns {Mesh|Group}
     */
    getModel(name) {
        return this._listModels.hasOwnProperty(name) ? this._listModels[name].clone() : null;
    }

    /**
     * Get all models
     *
     * @returns {Object.<{string: (Mesh|Group)}>}
     */
    getAllModels() {
        return this._listModels;
    }

	/**
	 *
	 * @param {loadCompleted} [listener]
	 * @returns {Loader}
	 */
	loadAllObjects(listener) {
		this._loadListener = listener;
		this._start('/load/all', {except: this._keysModels});
		return this;
	}

    /**
     * Load specific or all models
     *
	 * @param {(Array|string)} [names] - If is empty array that need load all models
     * @param {loadCompleted} [listener]
     * @returns {Loader}
     */
    loadSpecificObjects(names, listener) {
        let loadNames = Array.isArray(names) ? names : (names ? [names] : []);
        for (let i = 0; i < loadNames.length; i++) {
            if (this._keysModels.indexOf(loadNames[i]) >= 0) {
                loadNames.splice(i, 1);
            }
        }
		this._loadListener = listener;
		this._start('/load/specific', {load: loadNames});
        return this;
    }

    /**
     *
     * @param {Loader}
     * @callback loadCompleted
     */

    /**
     * Start load.
     *
	 * @param {string} path
     * @param {Object} names
     * @returns {Loader}
     */
    _start(path, names) {
        this._cleanTempOptions();
        let msg = 'Was not able to load models';
        this._ajax
            .post(path, names)
            .then((json) => {
                try {
                    let data = JSON.parse(json);
                    this._tempNames = Object.keys(data['obj']);
                    this._startLoadMTL(data['obj'], data['mtl']);
                } catch (e) {
                    this._msg.alert(msg);
                }
            })
            .catch(() => {
                this._msg.alert(msg);
            });
        return this;
    }

    /**
     *
     * @param {string} name - This is specific model's name
     * @param {Object} models - The are models from server
     * @param {Object} mtl - The list path to specific models
     * @private
     */
    _loadingMTL(name, models, mtl) {
        let model = models[name];
        if (mtl.hasOwnProperty(name)) {
            let path = mtl[name];
            let arr = path.match(/^(.*)(\/[^\/]*\.mtl)/);
            if (arr.length === 3) {
                this._mtl.setPath(arr[1]);
                this._mtl.load(arr[2], (materials) => {
                    materials.preload();
                    this._obj.setMaterials(materials);
                    this._addModel(name, this._obj.parse(model));
                    this._startLoadMTL(models, mtl);
                });
            } else {
                this._addModel(name, this._obj.parse(model));
                this._msg.alert('The path to MTL file is not correct');
            }
        } else {
            this._addModel(name, this._obj.parse(model));
        }
    }

    /**
     *
     * @param {Object} models - The are models from server
     * @param {Object} mtl - The list path to specific models
     * @private
     */
    _startLoadMTL(models, mtl) {
        let name = this._getNextName();
        if (models.hasOwnProperty(name)) {
            this._loadingMTL(name, models, mtl);
        } else {
            this._cleanTempOptions();
            this._addListener();
        }
    }

    /**
     * Add listener after all loading
     *
     * @returns {void}
     * @private
     */
    _addListener() {
        if (this._loadListener) {
            this._loadListener(this);
        }
    }

    /**
     *
     * @param {string} name - This is specific model's name
     * @param {Mesh|Group} model
     * @returns {Loader}
     * @private
     */
    _addModel(name, model) {
        this._listModels[name] = model;
        this._keysModels.push(name);
        return this;
    }

    /**
     * Clean temporary options
     *
     * @returns {Loader}
     * @private
     */
    _cleanTempOptions() {
        this._tempNames = [];
        this._currentTempKey = 0;
        return this;
    }

    /**
     * Gets next model's name to loading MTL
     *
     * @returns {string|undefined}
     * @private
     */
    _getNextName() {
        let name = this._tempNames[this._currentTempKey];
        this._currentTempKey++;
        return name;
    }
}

export default Loader;