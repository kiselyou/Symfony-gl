import * as THREE from 'three';
import Ship from './Ship';
import CalculateMoving from './CalculateMoving';

class ShipControls extends Ship {
    constructor() {
        super();

		/**
		 * To enable moving set it to true
		 *
		 * @type {boolean}
		 * @private
		 */
		this._enableMoving = false;

		/**
		 *
		 * @type {CalculateMoving}
		 * @private
		 */
		this._calculateMoving = new CalculateMoving();
    }

	/**
	 * Calculate
	 *
	 * @param {Vector3} target
	 * @returns {ShipControls}
	 */
	moveShip(target) {
		this._calculateMoving
			.setPositionDestination(target)
	        .setPositionOriginal(this.getPosition())
			.startCalculate()
			.drawDashLine();

		this.startMove();
	    return this;
    }

	/**
	 *
	 * @returns {ShipControls}
	 */
	startMove() {
		this._enableMoving = true;
		this._calculateMoving.startMoving();
		return this;
	}

	/**
	 *
	 * @returns {ShipControls}
	 */
	stopMove() {
		this._enableMoving = false;
		this._calculateMoving.stopMoving();
		return this;
	}

	/**
	 *
	 * @param {number} value
	 * @returns {ShipControls}
	 */
	setRadiusTurn(value) {
		this._calculateMoving.setRadius(value);
		return this;
	}

	/**
	 *
	 * @param {number} deltaTime
	 * @returns {void}
	 */
	update(deltaTime) {
		if (this._enableMoving) {
			this._calculateMoving.update(deltaTime, this.getObject());
		}
	}
}

export default ShipControls;