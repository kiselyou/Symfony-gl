import * as THREE from 'three';
import Player from './Player';
import Loader from './../../play/loader/Loader';
import PlayerAim from './PlayerAim';

class PlayerControls extends Player {
	constructor() {
		super();

		/**
		 *
		 * @type {Loader}
		 * @private
		 */
		this._loader = Loader.get();

		this._aim = new PlayerAim();
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
			this._aim.setAim(destination['point']);
			if (destination.hasOwnProperty('point') && !this.ship.isEnabledMove()) {
				this.ship.setTarget(destination['point']);
				if (this.showTargetPath) {
					this.ship.setDashPath();
				}
			}
        });

		this.initScene.domElement.addEventListener('dblclick', (e) => {
			if (this.keyBoard.moveByDoubleClick) {
				let destination = this.initScene.getClickIntersection(e, this.sky.plane);
				if (destination.hasOwnProperty('point')) {
					this.ship
						.setTarget(destination['point'])
						.removeDashPath()
						.startMove();
				}
			}
		});

		window.addEventListener('keydown', (e) => {
			switch (e.keyCode) {
				case this.keyBoard.startOrStopMoveShip.code:
					if (!this.ship.isEnabledMove()) {
						this.ship.startMove();
						this.ship.removeDashPath();
					} else {
						this.ship.stopMove();
						if (this.showTargetPath) {
							this.ship.setDashPath();
						}
					}
					break;
				case this.keyBoard.targetPath.code:
					this.showTargetPath = !this.showTargetPath;
					if (!this.showTargetPath) {
						this.ship.removeDashPath();
					}
					break;
			}
		});

	    window.addEventListener('keyup', (e) => {

	    });

        return this;
    }
}

export default PlayerControls;