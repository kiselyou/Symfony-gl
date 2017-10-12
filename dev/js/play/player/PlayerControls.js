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
            console.log(this.initScene.getClickPosition(e), '----');
        });
        return this;
    }
}

export default PlayerControls;