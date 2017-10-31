import * as THREE from 'three';
import DockSettings from './DockSettings';

class Dock extends DockSettings {
	/**
	 *
	 * @param {Scene} scene
	 */
	constructor(scene) {
		super();

		/**
		 *
		 * @type {Scene}
		 * @private
		 */
		this._scene = scene;

		/**
		 * This is mesh of Dock
		 *
		 * @type {?Mesh|Group}
		 * @private
		 */
		this._dock = null;

		/**
		 * This is mesh of Ship
		 *
		 * @type {?Mesh|Group}
		 * @private
		 */
		this._ship = null;

		/**
		 *
		 * @type {boolean}
		 */
		this.isDock = false;
	}

	/**
	 *
	 * @param {Mesh|Group} meshDock
	 * @param {Mesh|Group} meshShip
	 * @returns {Dock}
	 */
	set(meshDock, meshShip) {
		this._ship = meshShip;
		this._ship.scale.copy(this.scaleShip);
		this._dock = meshDock;

		let pointLight = new THREE.PointLight(0xFFFFFF, 1);
		pointLight.position.set(0, 200, -2000);
		this._dock.add(pointLight);

		let hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1);
		hemisphereLight.position.set(1500, 1500, -1500);
		this._dock.add(hemisphereLight);

		let hemisphereLight2 = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.6);
		hemisphereLight2.position.set(2500, 200, -2000);
		this._dock.add(hemisphereLight2);

		let pointLight2 = new THREE.PointLight(0xffee88, 1, 0, 2);
		pointLight2.castShadow = true;
		pointLight2.power = 100;
		pointLight2.position.set(2500, 200, -2000);
		this._dock.add(pointLight2);

		this._dock.add(this._ship);
		this._dock.scale.copy(this.scale);
		this.isDock = true;
		this._scene.add(this._dock);
		return this;
	}

	/**
	 *
	 * @returns {Dock}
	 */
	remove() {
		if (this.isDock) {
			this._scene.remove(this._dock);
			this._dock = null;
			this.isDock = false;
		}
		return this;
	}

	/**
	 *
	 * @returns {Mesh|Group}
	 */
	get() {
		return this._dock;
	}
}

export default Dock;