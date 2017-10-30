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

		let directionalLight = new THREE.DirectionalLight(0x000000, 1);
		directionalLight.position.set(0, 1, 0).normalize();
		this._dock.add(directionalLight);

		let pointLight = new THREE.PointLight(0xFFFFFF, 1);
		pointLight.position.set(0, 200, -2000);
		this._dock.add(pointLight);

		let hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 0.8);
		hemisphereLight.position.set(1500, 1500, -1500);
		this._dock.add(hemisphereLight);
		
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