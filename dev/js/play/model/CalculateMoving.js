import * as THREE from 'three';

class CalculateMoving {
	constructor() {

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._speed = 500;

		/**
		 * Radius
		 *
		 * @type {number}
		 * @private
		 */
		this._r = 150;

		/**
		 * Angle direction
		 *
		 * @type {number}
		 * @private
		 */
		this._ad = 0;

		/**
		 * Point O (Original position)
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._po = new THREE.Vector3();

		/**
		 * Point P (90 degree from Original position)
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._pp = new THREE.Vector3();

		/**
		 * Point D (Destination position)
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._pd = new THREE.Vector3();

		/**
		 * Point Q (Position which leave the circle)
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._pq = new THREE.Vector3();
	}

	/**
	 * Calculate position of point P
	 *
	 * @param {number} angle Possible values ( +90 | -90 )
	 * @param {number} radius
	 * @returns {{x: number, y: number, z: number}}
	 * @private
	 */
	_calculatePositionP(angle, radius) {
		let angleToP = this._ad - angle;
		return {
			x: this._po.x + radius * Math.cos(angleToP),
			y: 0,
			z: this._po.z + radius * Math.sin(angleToP)
		}
	}

	/**
	 * Calculate length H
	 *
	 * @param {{x: number, y: number, z: number}} pp
	 * @returns {number}
	 * @private
	 */
	_calculateLengthH(pp) {
		let x = this._pd.x - pp.x;
		let z = this._pd.z - pp.z;
		return Math.sqrt(x * x + z * z);
	}

	/**
	 * Calculate position point Q
	 *
	 * @param {{x: number, y: number, z: number}} pp
	 * @param {number} lh
	 * @param {number} radius
	 * @returns {{x: number, y: number, z: number}}
	 * @private
	 */
	_calculatePositionQ(pp, lh, radius) {
		let theta = Math.acos(radius / lh);
		let x = this._pd.x - pp.x;
		let z = this._pd.z - pp.z;
		let phi = Math.atan(z / x);
		return {
			x: pp.x + radius * Math.cos(phi + theta),
			y: 0,
			z: pp.z + radius * Math.sin(phi + theta)
		}
	}

	/**
	 *
	 * @private
	 */
	_calculate() {
		let rLeft = this._r;
		let pLeft = this._calculatePositionP(90, rLeft);
		let hLeft = this._calculateLengthH(pLeft);
		if (hLeft < rLeft) {
			rLeft = hLeft / 2;
			pLeft = this._calculatePositionP(90, rLeft);
			hLeft = this._calculateLengthH(pLeft);
		}

		let rRight = this._r;
		let pRight = this._calculatePositionP(- 90, rRight);
		let hRight = this._calculateLengthH(pRight);
		if (hRight < rRight) {
			rRight = hRight / 2;
			pRight = this._calculatePositionP(90, rRight);
			hRight = this._calculateLengthH(pRight);
		}

		let dLeft = Math.sqrt(hLeft * hLeft - rLeft * rLeft);
		let dRight = Math.sqrt(hRight * hRight - rRight * rRight);

		if (dLeft < dRight) {
			this._pq.copy(this._calculatePositionQ(pLeft, hLeft, rLeft));
			this._pp.copy(pLeft);
		} else {
			this._pq.copy(this._calculatePositionQ(pRight, hRight, rRight));
			this._pp.copy(pRight);
		}
	}

	/**
	 * Sets radius
	 *
	 * @param {number} value
	 * @returns {CalculateMoving}
	 */
	setRadius(value) {
		this._r = value;
		return this;
	}

	/**
	 *
	 * @param {Vector3} value
	 * @returns {CalculateMoving}
	 */
	setAngleDirection(value) {
		this._ad = Math.atan2(value.x, value.z);
		return this;
	}

	/**
	 *
	 * @param {Vector3} value
	 * @returns {CalculateMoving}
	 */
	setPositionDestination(value) {
		this._pd = value;
		return this;
	}

	/**
	 *
	 * @param {Vector3} value
	 * @returns {CalculateMoving}
	 */
	setPositionOriginal(value) {
		this._po = value;
		return this;
	}

	update() {

	}
}

export default CalculateMoving;