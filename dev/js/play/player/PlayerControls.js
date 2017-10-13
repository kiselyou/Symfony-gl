import * as THREE from 'three';
import Player from './Player';
import Loader from './../../play/loader/Loader';

class PlayerControls extends Player {
	constructor() {
		super();

		/**
		 *
		 * @type {Loader}
		 * @private
		 */
		this._loader = Loader.get();
	}

	/**
	 *
	 * @param {function} listener
	 * @return {PlayerControls}
	 */
	load(listener) {
		this._loader.load((loader) => {
			this.setShip(loader.getModel(this.modelShipName));
			if (listener) {
				listener();
			}
		}, this.modelShipName);
		return this;
	}

    /**
     *
     * @returns {PlayerControls}
     */
    initEvents() {
        this.initScene.domElement.addEventListener('click', (e) => {
			let destination = this.initScene.getClickIntersection(e, this.sky.plane);
			if (destination.hasOwnProperty('point')) {
				//TODO remove this.initScene.scene
				this.ship.moveShip(destination['point'], this.initScene.scene);
			}
        });
        return this;
    }
}

export default PlayerControls;