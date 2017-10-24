import * as THREE from 'three';
import SkyBox from './../environment/SkyeBox';
import PlayerSettings from './PlayerSettings';
import OrbitControls from './../controls/OrbitControls';
import InitScene from '../scene/InitScene';
import ShipControls from './../model/ShipControls';
import StationControls from './../station/StationControls';
import PlayerAim from './PlayerAim';
import Loader from './../../play/loader/Loader';

class Player extends PlayerSettings {
    constructor() {
    	super();

        /**
         * This is mesh of model
         *
         * @type {ShipControls}
         * @private
         */
        this._ship = new ShipControls();

		/**
		 * This is mesh of station
		 *
		 * @type {StationControls}
		 * @private
		 */
		this._station = new StationControls();

        /**
         *
         * @type {boolean}
         * @private
         */
        this._isModelOnScene = false;

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isStationOnScene = false;

	    /**
	     *
	     * @type {InitScene}
	     * @private
	     */
	    this._initScene = InitScene.get();

		/**
		 *
		 * @type {PlayerAim}
		 * @private
		 */
		this._aim = new PlayerAim();

	    /**
         *
	     * @type {SkyeBox}
	     * @private
	     */
	    this._sky = new SkyBox(this._initScene.scene);

		/**
		 *
		 * @type {Loader}
		 * @private
		 */
		this._loader = Loader.get();

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
	    this._orbitControls.minDistance = 50;
	    this._orbitControls.maxDistance = 300;
    }

	/**
	 *
	 * @returns {PlayerAim}
	 */
	get aim() {
    	return this._aim;
	}

	/**
	 *
	 * @return {SkyeBox}
	 */
	get sky() {
    	return this._sky;
    }

	/**
	 *
	 * @returns {ShipControls}
	 */
	get ship() {
		return this._ship;
    }

    /**
	 *
	 * @returns {StationControls}
	 */
	get station() {
		return this._station;
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
	 *
	 * @return {?Vector3}
	 */
	get stationPosition() {
		return this._isStationOnScene ? this._station.getPosition() : null;
	}

    /**
     * Check status of model. Added it to the scene or not
     *
     * @returns {boolean}
     */
    get isModel() {
        return this._isModelOnScene;
    }

	/**
	 * Check status of station. Added it to the scene or not
	 *
	 * @returns {boolean}
	 */
	get isStation() {
		return this._isStationOnScene;
	}

    /**
     * Set model and add it to the scene
     *
     * @param {Mesh|Group} mesh
     * @returns {Player}
     */
    setShip(mesh) {
		this.removeShip();
        this.setEnv(this.envPath);
        this._ship
            .setObject(mesh)
            .setPosition(this.modelShipPosition);
        this._initScene.scene.add(this._ship.getObject());
		this._initScene.showGridHelper(this.isEnabledHelper);

        this._orbitControls.enabled = this.isEnabledOrbitControls;
		this._orbitControls.autoRotate = false;
		this._orbitControls.minDistance = 0;
		this._orbitControls.maxDistance = Infinity;
		this._orbitControls.minPolarAngle = 0;
		this._orbitControls.maxPolarAngle = Math.PI;

        this._isModelOnScene = true;
        return this;
    }

	/**
	 * Set model and add it to the scene
	 *
	 * @param {Mesh|Group} mesh
	 * @returns {Player}
	 */
	setStation(mesh) {
		this.removeStation();
		this._station
			.setObject(mesh)
			.setPosition(this.modelStationPosition);
		this._initScene.scene.add(this._station.getObject());
		this._isStationOnScene = true;
		return this;
	}

	/**
	 *
	 * @param {function} listener
	 * @return {PlayerControls}
	 */
	startPlay(listener) {
		this._loader.loadAllObjects((loader) => {
			this.setShip(loader.getModel(this.modelShipName));
			this.setStation(loader.getModel(this.modelStationName));
			if (listener) {
				listener();
			}
		});
		return this;
	}

	buildDock(listener) {
		this._loader.loadSpecificObjects([this.modelStationName, this.modelShipName], (loader) => {
			// console.log(
			// 	loader.getModel(this.modelStationName),
			// 	loader.getModel(this.modelShipName)
			// );
			this.setStation(loader.getModel(this.modelStationName));
			this._station
				.setScale(new THREE.Vector3(45, 45, 45))
				.setPosition(new THREE.Vector3(0, 0, 0));

			this.setShip(loader.getModel(this.modelShipName));
			this._ship
				.setScale(new THREE.Vector3(25, 25, 25))
				.setPosition(new THREE.Vector3(0, 0, 0));

			this._initScene.showGridHelper(false);

			this._orbitControls.target = new THREE.Vector3(0, 0, 0);
			this._orbitControls.enabled = true;
			this._orbitControls.autoRotate = true;
			this._orbitControls.autoRotateSpeed = 0.1;
			this._orbitControls.minDistance = 800;
			this._orbitControls.maxDistance = 800;
			this._orbitControls.maxPolarAngle = Math.PI / 3;
			this._orbitControls.minPolarAngle = Math.PI / 3;

			if (listener) {
				listener();
			}
		});
	}

    /**
     * Remove model ship from the scene
     *
     * @returns {Player}
     */
    removeShip() {
		if (this.isModel) {
			this._initScene.scene.remove(this._ship.getObject());
			this._isModelOnScene = false;
		}
        return this;
    }

	/**
	 * Remove model station from the scene
	 *
	 * @returns {Player}
	 */
	removeStation() {
		if (this.isStation) {
			this._initScene.scene.remove(this._station.getObject());
			this._isStationOnScene = false;
		}
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
	 *
	 * @param {number} deltaTime
     * @returns {void}
	 */
	update(deltaTime) {
		if (this.isModel) {
			this._sky.setPosition(this.modelPosition);
			this._ship.update(deltaTime);
		}

		if (this.isModel || this.isStation) {
			// this._orbitControls.target = this.modelPosition;
			this._orbitControls.update();
		}
    }
}

export default Player;