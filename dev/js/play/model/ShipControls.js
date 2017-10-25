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
	 * Sets radius of speed
	 *
	 * @param {number} speed
	 * @returns {ShipControls}
	 */
	setSpeed(speed) {
		this._calculateMoving.speed = speed;
		return this;
	}

	/**
	 * Sets radius of radius
	 *
	 * @param {number} radius
	 * @returns {ShipControls}
	 */
	setRadius(radius) {
		this._calculateMoving.radius = radius;
		return this;
	}

	/**
	 * Calculate
	 *
	 * @param {Vector3} value
	 * @returns {ShipControls}
	 */
	setTarget(value) {
		this._calculateMoving
			.setPositionDestination(value)
	        .setPositionOriginal(this.getPosition())
			.startCalculate();
	    return this;
    }

	/**
	 *
	 * @param {Vector3} position
	 * @callback listenerMoving
	 */

	/**
	 * This is constants of current class
	 *
	 * @param {string} event possible values ('stop'|'direct')
	 * @param {listenerMoving} listener
	 * @returns {ShipControls}
	 */
    addEvent(event, listener) {
	    this._calculateMoving.addEventListener(event, listener);
	    return this;
    }

	/**
	 * Set path to target.
	 * Use this method after "startTarget()"
	 *
	 * @returns {ShipControls}
	 */
	setDashPath() {
	    this._calculateMoving.drawDashLine();
	    return this;
    }

	/**
	 * Remove path to target.
	 *
	 * @returns {ShipControls}
	 */
	removeDashPath() {
		this._calculateMoving.removeDashLine();
		return this;
	}

	/**
	 *
	 * @returns {ShipControls}
	 */
	startMove() {
		this._calculateMoving.startMoving();
		return this;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	isEnabledMove() {
		return this._calculateMoving.isEnabledMove();
	}

	/**
	 *
	 * @returns {ShipControls}
	 */
	stopMove() {
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
		if (this.isEnabledMove()) {
			this._calculateMoving.update(deltaTime, this.getObject());
		}
	}
}

export default ShipControls;