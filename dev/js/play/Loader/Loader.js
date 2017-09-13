import * as THREE from 'three';

import MTLLoader from './MTLLoader';
import OBJLoader from './OBJLoader';
import ProgressAjax from './../../system/progress/ProgressAjax';

import Application from './../../system/Application';

import {
    BASE_DIR_OBJ
} from './../../ini/obj.ini';

let inst = null;

class Loader extends Application {
    constructor() {
        super();

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
        this._loaderMTL = new MTLLoader(this._manager);

        /**
         *
         * @type {OBJLoader}
         * @private
         */
        this._loaderOBJ = new OBJLoader(this._manager);

        /**
         *
         * @type {Array.<{name: string, path: string, element: (Mesh|Group)}>}
         * @private
         */
        this._listModels = {};

        this._iniManager();

        this._startKey = 0;
        this._keys = [];

        this.listener = null;
    }

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
        return inst || (inst = new Loader());
    }

    /**
     * Get model by name
     *
     * @param {string} name
     * @returns {Mesh|Group}
     */
    getObj(name) {
        return this._listModels.hasOwnProperty(name) ? this._listModels[name] : null;
    }

    /**
     *
     * @callback loadCompleted
     */

    /**
     * Start load.
     * You should run in method only one time
     *
     * @param {loadCompleted} [listener]
     * @returns {Loader}
     */
    start(listener) {
        this.listener = listener;
        this.ajax
            .post('/load/obj')
            .then((json) => {
                try {
                    this._startKey = 0;
                    let data = JSON.parse(json);
                    let models = data['obj'];
                    this._keys = Object.keys(models);
                    this._prepareOBJ(models, data['mtl']);

                } catch (e) {
                    console.log(e);
                    this.msg.alert('Cannot load models');
                }
            })
            .catch((e) => {
                console.log(e);
                this.msg.alert('Cannot load models');
            });
        return this;
    }

    _prepareMTL(name, models, mtl) {
        let model = models[name];
        if (mtl.hasOwnProperty(name)) {
            this._loaderMTL.load(BASE_DIR_OBJ + mtl[name], (materials) => {
                materials.preload();
                this._loaderOBJ.setMaterials(materials);
                this._listModels[name] = this._loaderOBJ.parse(model);
                this._prepareOBJ(models, mtl);
            });
        } else {
            this._listModels[name] = this._loaderOBJ.parse(model);
        }
    }

    _prepareOBJ(models, mtl) {
        let name = this._keys[this._startKey];
        if (models.hasOwnProperty(name)) {
            this._startKey++;
            this._prepareMTL(name, models, mtl);
        } else {
            this._keys = [];
            this._startKey = 0;
            if (this.listener) {
                this.listener(this);
            }
        }
    }
}

export default Loader;