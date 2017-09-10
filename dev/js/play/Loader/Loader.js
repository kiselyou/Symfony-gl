import * as THREE from 'three';
import Application from './../../system/Application';

let inst = null;

class Loader extends Application {
    constructor() {
        super();

        /**
         *
         * @type {any}
         * @private
         */
        this._loader = new THREE.ObjectLoader();

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
                    let models = JSON.parse(json);
                    for (let key in models) {
                        if (models.hasOwnProperty(key)) {
                            this._listModels[key] = this._loader.parse(models[key]);
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
}

export default Loader;