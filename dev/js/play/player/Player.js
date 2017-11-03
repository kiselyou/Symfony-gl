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
         */
        this.ship = new ShipControls();

	    /**
	     *
	     * @type {InitScene}
	     */
	    this.initScene = InitScene.get();

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
		this.sector = new SectorControls(this.initScene.scene);

		/**
		 * This is mesh of station
		 *
		 * @type {DockControls}
		 * @private
		 */
		this._dock = new DockControls(this.initScene.scene);

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
		 * @type {boolean}
		 */
		this.findShip = false;

	    /**
	     *
	     * @type {OrbitControls}
	     */
	    this.oc = new OrbitControls(this.initScene.camera, this.initScene.domElement);
	    this.oc.mouseButtons = {ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT};
    }

	/**
	 *
	 * @returns {PlayerAim}
	 */
	get aim() {
    	return this._aim;
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

			this.ship
				.setSpeed(this.speed)
				.setSpeedRadius(this.speedRadius)
				.setRadius(this.radius)
				.setObject(loader.getModel(this.shipName))
				.setPosition(this.startPositionShip);

			this.initScene.scene.add(this.ship.getObject());
			this.initScene.showGridHelper(this.girdHelperEnable);
			this.oc.enabled = this.orbitEnabled;
			this.oc.enableKeys = this.orbitEnableKeys;
			this.oc.autoRotate = this.orbitAutoRotate;
			this.oc.minDistance = this.orbitMinDistance;
			this.oc.maxDistance = this.orbitMaxDistance;
			this.oc.minPolarAngle = this.orbitMinPolarAngle;
			this.oc.maxPolarAngle = this.orbitMaxPolarAngle;
			this.oc.enablePan = true;
			this.oc.enableMouseMoveCamera();
			this.oc.update();
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
			this.initScene.showGridHelper(false);
			this.oc.target = this.startPositionShip;
			this.oc.enabled = this._dock.orbitEnabled;
			this.oc.autoRotate = this._dock.orbitAutoRotate;
			this.oc.autoRotateSpeed = this._dock.orbitAutoRotateSpeed;
			this.oc.minDistance = this._dock.orbitMinDistance;
			this.oc.maxDistance = this._dock.orbitMaxDistance;
			this.oc.minPolarAngle = this._dock.orbitMinPolarAngle;
			this.oc.maxPolarAngle = this._dock.orbitMaxPolarAngle;
			this.oc.enablePan = false;
			this.oc.update();
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
			this.initScene.scene.remove(this.ship.getObject());
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
			if (this.findShip) {
				this.oc.target.copy(this.ship.getPosition());
			}

			this.oc.update();
			this.ship.update(deltaTime);
			this.sector.update(this.initScene.camera.position, deltaTime);
		}

		if (this._dock.isDock) {
			this.oc.update();
		}
    }
}

export default Player;