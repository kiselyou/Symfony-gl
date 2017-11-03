import Player from './Player';

class PlayerControls extends Player {
	constructor() {
		super();
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
			let destination = this.initScene.getClickIntersection(e, this.sector.plane);
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
				let destination = this.initScene.getClickIntersection(e, this.sector.plane);
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
				case this.keyBoard.findShip.code:
					this.findShip = true;
					this.oc.enablePan = false;
					break;
			}
		});

	    window.addEventListener('keyup', (e) => {
			switch (e.keyCode) {
				case this.keyBoard.startOrStopMoveShip.code:

					break;
				case this.keyBoard.targetPath.code:

					break;
				case this.keyBoard.findShip.code:
					this.findShip = false;
					this.oc.enablePan = true;
					break;
			}
	    });

        return this;
    }
}

export default PlayerControls;