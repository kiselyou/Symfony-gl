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
		this._ship.position.copy(this.position);
		this._dock = meshDock;
		this._dock.add(this._ship);
		this._dock.scale.copy(this.scale);
		this._dock.position.copy(this.position);
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