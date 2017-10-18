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

    	this.ship.addEvent('stop', () => {
		    this.aim.removeFlag();
	    });

        this.initScene.domElement.addEventListener('click', (e) => {
			let destination = this.initScene.getClickIntersection(e, this.sky.plane);
			this.aim.setAim(destination['point']);
			if (destination.hasOwnProperty('point') && !this.ship.isEnabledMove()) {
				this.ship.setTarget(destination['point']);
				this.aim.setFlag(destination['point']);

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

					this.aim
						.removeAim()
						.setFlag(destination['point']);
				}
			}
		});

		window.addEventListener('keydown', (e) => {
			switch (e.keyCode) {
				case this.keyBoard.startOrStopMoveShip.code:
					if (!this.ship.isEnabledMove()) {
						this.ship
							.startMove()
							.removeDashPath();
					} else {
						this.ship.stopMove();
						this.aim.removeAim();
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