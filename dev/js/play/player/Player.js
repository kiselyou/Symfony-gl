import * as THREE from 'three';
import PlayerSettings from './PlayerSettings';
import OrbitControls from './../controls/OrbitControls';
import InitScene from '../scene/InitScene';
import ShipControls from './../model/ShipControls';
import DockControls from './../station/DockControls';
import PlayerAim from './PlayerAim';
import Loader from './../../play/loader/Loader';
import SectorControls from './../environment/sectors/SectorControls';

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
		 * @type {SectorControls}
		 */
		this.sector = new SectorControls(this._initScene.scene);

		/**
		 * This is mesh of station
		 *
		 * @type {DockControls}
		 * @private
		 */
		this._dock = new DockControls(this._initScene.scene);

		/**
		 *
		 * @type {Loader}
		 * @private
		 */
		this._loader = Loader.get();

		/**
		 *
		 * @type {boolean}
		 */
		this.isSpace = false;

	    /**
	     *
	     * @type {OrbitControls}
	     * @private
	     */
	    this._orbitControls = new OrbitControls(this._initScene.camera, this._initScene.domElement);
	    this._orbitControls.mouseButtons = {ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT};
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
	 * @returns {ShipControls}
	 */
	get ship() {
		return this._ship;
    }

	/**
	 *
	 * @returns {InitScene}
	 */
	get initScene() {
    	return this._initScene;
    }

	/**
	 * Build environment of space
	 *
	 * @param {function} listener
	 * @return {Player}
	 */
	goToSpace(listener) {
		this._loader.loadAllObjects((loader) => {
			this._dock.remove();
			this.removeShip();
			this.sector.init(this.sectorKey);

			this._ship
				.setSpeed(this.speed)
				.setSpeedRadius(this.speedRadius)
				.setRadius(this.radius)
				.setObject(loader.getModel(this.shipName))
				.setPosition(this.startPositionShip);

			this._initScene.scene.add(this._ship.getObject());
			this._initScene.showGridHelper(this.girdHelperEnable);
			this._orbitControls.enabled = this.orbitEnabled;
			this._orbitControls.enablePan = this.orbitEnablePan;

			this._orbitControls.enableKeys = this.orbitEnableKeys;
			this._orbitControls.autoRotate = this.orbitAutoRotate;
			this._orbitControls.minDistance = this.orbitMinDistance;
			this._orbitControls.maxDistance = this.orbitMaxDistance;
			this._orbitControls.minPolarAngle = this.orbitMinPolarAngle;
			this._orbitControls.maxPolarAngle = this.orbitMaxPolarAngle;
			this._orbitControls.enableMouseMoveCamera();
			this._orbitControls.update();
			this.isSpace = true;

			if (listener) {
				listener();
			}
		});
		return this;
	}

	/**
	 * Build dock and ship of user
	 *
	 * @param {function} [listener]
	 * @returns {Player}
	 */
	goToDock(listener) {
		this._loader.loadSpecificObjects([this._dock.name, this.shipName], (loader) => {
			this.sector.remove();
			this._dock.remove();
			this._dock.set(loader.getModel(this._dock.name), loader.getModel(this.shipName));
			this._initScene.showGridHelper(false);
			this._orbitControls.target = this.startPositionShip;
			this._orbitControls.enabled = this._dock.orbitEnabled;
			this._orbitControls.autoRotate = this._dock.orbitAutoRotate;
			this._orbitControls.autoRotateSpeed = this._dock.orbitAutoRotateSpeed;
			this._orbitControls.minDistance = this._dock.orbitMinDistance;
			this._orbitControls.maxDistance = this._dock.orbitMaxDistance;
			this._orbitControls.minPolarAngle = this._dock.orbitMinPolarAngle;
			this._orbitControls.maxPolarAngle = this._dock.orbitMaxPolarAngle;
			this._orbitControls.update();
			if (listener) {
				listener();
			}
		});
		return this;
	}

	/**
	 *
	 * @returns {Player}
	 */
	removeDock() {
		this._dock.remove();
		return this;
	}

    /**
     * Remove model ship from the scene
     *
     * @returns {Player}
     */
    removeShip() {
    	if (this.isSpace) {
			this._initScene.scene.remove(this._ship.getObject());
			this.sector.remove();
			this.isSpace = false;
		}
        return this;
    }

	/**
	 *
	 * @param {number} deltaTime
     * @returns {void}
	 */
	update(deltaTime) {
		if (this.isSpace) {
			// console.log(this._initScene.camera.position);

			this._ship.update(deltaTime);

			let p = this._ship.getPosition();

			this.sector.update(this._initScene.camera.position, deltaTime);

			// this._initScene.camera.position.copy(p);
			// this._orbitControls.target.copy(this._ship.getPosition());
			this._orbitControls.update();
		}

		if (this._dock.isDock) {
			this._orbitControls.update();
		}
    }
}

export default Player;