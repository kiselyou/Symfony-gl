
class PlayerModel {
    /**
     *
     * @param {Scene} scene
     */
    constructor(scene) {

        /**
         * This is mesh of model
         *
         * @type {?Mesh|Group}
         * @private
         */
        this._model = null;

        /**
         *
         * @type {Scene}
         * @private
         */
        this._scene = scene;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._isModelOnScene = false;
    }

    /**
     * Get mesh of model
     *
     * @returns {Mesh|Group}
     */
    getModel() {
        return this._model;
    }

    get position() {
        return this._isModelOnScene ? this._model.position : null;
    }

    /**
     * Check status of model. Added it to the scene
     *
     * @returns {boolean}
     */
    get isModel() {
        return this._isModelOnScene;
    }

    /**
     * Set model and add it to scene
     *
     * @param {Mesh|Group} mesh
     * @returns {PlayerModel}
     */
    setModel(mesh) {
        if (this.isModel) {
            this.removeModel();
        }
        this._model = mesh;
        this._scene.add(this._model);
        this._isModelOnScene = true;
        return this;
    }

    /**
     * Remove model from the scene
     *
     * @returns {PlayerModel}
     */
    removeModel() {
        this._scene.remove(this._model);
        this._isModelOnScene = false;
        return this;
    }
}

export default PlayerModel;