import * as THREE from 'three';
import MTLLoader from 'three-mtl-loader';
import Application from './../../system/Application';

import {
    TEMP_DIR_OBJ
} from './../../ini/obj.ini';

let inst = null;

class Loader extends Application {
    constructor() {
        super();

        /**
         *
         * @type {THREE.ObjectLoader|ObjectLoader}
         * @private
         */
        this._loader = new THREE.ObjectLoader();

        /**
         *
         * @type {MTLLoader}
         * @private
         */
        this._loaderMTL = new MTLLoader();

        /**
         *
         * @type {Array.<{name: string, path: string, element: (Mesh|Group)}>}
         * @private
         */
        this._listModels = {};
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
        this.ajax
            .post('/load/obj')
            .then((json) => {
                try {
                    let data = JSON.parse(json);
                    let models = data['obj'];
                    let mtl = data['mtl'];
                    console.log(models);



                    for (let key in models) {
                        if (models.hasOwnProperty(key)) {
                            let obj = this._loader.parse(models[key]);
                            // console.log(obj);
                            this._loadMTL(obj);
                            this._listModels[key] = obj;
                        }
                    }
                    if (listener) {
                        listener();
                    }
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

    _loadMTL(obj) {
        this._loaderMTL.load('./src/obj/test/Wraith.mtl', (materials) => {
            materials.preload();
            console.log(materials);

        });
    }
}

export default Loader;