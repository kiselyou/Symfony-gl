import * as THREE from 'three';
import Ship from './Ship';
import CalculateMoving from './CalculateMoving';

class ShipControls extends Ship {
    constructor() {
        super();

		/**
		 * The ship will follow to target
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._target = new THREE.Vector3();

		/**
		 * This is radius of turn
		 *
		 * @type {number}
		 * @private
		 */
		this._radiusTurn = 50;

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
	 *
	 * @returns {ShipControls}
	 */
	startMove() {
		this._enableMoving = true;
		return this;
	}

	/**
	 *
	 * @returns {ShipControls}
	 */
	stopMove() {
		this._enableMoving = false;
		return this;
	}

	/**
	 *
	 * @param {Vector3} value
	 */
	setTarget(value) {
		this._target.copy(value);
		return this;
	}

	/**
	 *
	 * @param {number} value
	 * @returns {ShipControls}
	 */
	setRadiusTurn(value) {
		this._radiusTurn = value;
		return this;
	}

	update() {
		if (this._enableMoving) {

		}
	}
}

export default ShipControls;