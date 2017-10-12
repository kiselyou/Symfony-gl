import * as THREE from 'three';
import SkyBox from './../skyebox/SkyeBox';
import PlayerSettings from './PlayerSettings';
import OrbitControls from './../controls/OrbitControls';
import InitScene from './../../play/scene/InitScene';

class Player extends PlayerSettings {
    constructor() {
    	super();

        /**
         * This is mesh of model
         *
         * @type {?Mesh|Group}
         * @private
         */
        this._model = null;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._isModelOnScene = false;

	    /**
	     *
	     * @type {InitScene}
	     * @private
	     */
	    this._initScene = InitScene.get();

	    /**
         *
	     * @type {SkyeBox}
	     * @private
	     */
	    this._sky = new SkyBox(this._initScene.scene);

	    /**
	     *
	     * @type {OrbitControls}
	     * @private
	     */
	    this._orbitControls = new OrbitControls(this._initScene.camera, this._initScene.domElement);
	    this._orbitControls.mouseButtons = {
		    ORBIT: THREE.MOUSE.RIGHT,
		    ZOOM: THREE.MOUSE.MIDDLE,
		    PAN: THREE.MOUSE.LEFT
	    };
	    this._orbitControls.enabled = false;
	    this._orbitControls.enablePan = false;
	    this._orbitControls.enableKeys = false;
	    this._orbitControls.minDistance = 300;
	    this._orbitControls.maxDistance = 3000;
    }

	/**
	 *
	 * @returns {InitScene}
	 */
	get initScene() {
    	return this._initScene;
    }

	/**
	 *
	 * @returns {Player}
	 */
	orbitControlsInitialisation() {
	    this._orbitControls.enabled = this.isEnabledOrbitControls;
	    return this;
	}

    /**
     * Get mesh of model
     *
     * @returns {Mesh|Group}
     */
    getModel() {
        return this._model;
    }

	/**
     *
	 * @return {?Vector3}
	 */
	get modelPosition() {
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
     * Set model and add it to the scene
     *
     * @param {Mesh|Group} mesh
     * @returns {Player}
     */
    setModel(mesh) {
        if (this.isModel) {
            this.removeModel();
        }
        this._model = mesh;
        this._initScene.scene.add(this._model);
        this._isModelOnScene = true;
        return this;
    }

    /**
     * Remove model from the scene
     *
     * @returns {Player}
     */
    removeModel() {
        this._initScene.scene.remove(this._model);
        this._isModelOnScene = false;
        return this;
    }

	/**
     * Set Environment to the scene
     *
	 * @param {string} path
	 * @returns {Player}
	 */
	setEnv(path) {
	    this._sky.buildEnv(path);
	    return this;
    }

	/**
	 * Remove Environment from the scene
	 *
	 * @returns {Player}
	 */
	removeEnv() {
		this._sky.removeEnv();
		return this;
	}

	/**
     * @returns {void}
	 */
	update() {
		if (this.isModel) {
			this._sky.setPosition(this.modelPosition);
			this._orbitControls.target = this.modelPosition;
			this._orbitControls.update();
		}
    }
}

export default Player;