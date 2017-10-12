import * as THREE from 'three';
import SkyBox from './../environment/SkyeBox';
import PlayerSettings from './PlayerSettings';
import OrbitControls from './../controls/OrbitControls';
import InitScene from '../scene/InitScene';
import Ship from '../model/Ship';

class Player extends PlayerSettings {
    constructor() {
    	super();

        /**
         * This is mesh of model
         *
         * @type {Ship}
         * @private
         */
        this._ship = new Ship();

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
	    this._orbitControls.minDistance = 500;
	    this._orbitControls.maxDistance = 2500;
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
	 * @return {?Vector3}
	 */
	get modelPosition() {
        return this._isModelOnScene ? this._ship.getPosition() : null;
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
    setShip(mesh) {
        if (this.isModel) {
            this.removeShip();
        }

        this.setEnv(this.envPath);
        this._ship
            .setObject(mesh)
            .setPosition(this.modelShipPosition);

        this._initScene.showGridHelper(this.isEnabledHelper);
        this._initScene.scene.add(this._ship.getObject());

        this._orbitControls.enabled = this.isEnabledOrbitControls;
        this._isModelOnScene = true;
        return this;
    }

    /**
     * Remove model from the scene
     *
     * @returns {Player}
     */
    removeShip() {
        this._initScene.scene.remove(this._ship.getObject());
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