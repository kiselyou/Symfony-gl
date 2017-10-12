
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
			this.orbitControlsInitialisation();
			let model = loader.getModel(this.modelShipName);
			model.position.copy(this.modelShipPosition);

			this
				.setEnv(this.envPath)
				.setModel(model);

			if (listener) {
				listener();
			}
		}, this.modelShipName);
		return this;
	}

	/**
	 * @returns {void}
	 */
	update() {
		super.update();
	}
}

export default PlayerControls;