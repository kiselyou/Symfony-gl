import * as THREE from 'three';

import HelperPoints from './../helpers/HelperPoints';

/**
 * Distance to calculate next position
 *
 * @type {number}
 */
const FAR = 20;

class CalculateMoving {
	constructor() {

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._speed = 20;

		/**
		 * Radius
		 *
		 * @type {number}
		 * @private
		 */
		this._r = 20;

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

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._tempRadius = 0;

		/**
		 *
		 * @type {string} (CalculateMoving.SIDE_LEFT|CalculateMoving.SIDE_RIGHT)
		 * @private
		 */
		this._tempSide = '';

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._tempAngle = 0;

		/**
		 * Point O (Original position)
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._po2 = new THREE.Vector3(0, 0, 0);

		/**
		 * Previous position of model
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._po1 = new THREE.Vector3(0, 0, -10);

		HelperPoints.get().add(this._po1, 1, 0x0F00FF);
	}

	static get SIDE_LEFT() {
		return 'left';
	}

	static get SIDE_RIGHT() {
		return 'right';
	}

	/**
	 *
	 * @param {number} degrees
	 * @returns {number}
	 */
	static degreesToRadians(degrees) {
		return degrees * Math.PI / 180;
	}

	/**
	 *
	 * @param {number} radians
	 * @returns {number}
	 */
	static radiansToDegrees(radians) {
		return radians * 180 / Math.PI;
	}

	/**
	 *
	 * @returns {number}
	 * @private
	 */
	_calculateAngleDirection() {
		let x = this._po2.x - this._po1.x;
		let z = this._po2.z - this._po1.z;
		return Math.atan2(z, x);
	}

	/**
	 * Calculate position of point P
	 *
	 * @param {number} angle - This is direction angle
	 * @param {number} radius
	 * @returns {{x: number, y: number, z: number}}
	 * @private
	 */
	_calculatePositionP(angle, radius) {
		return {
			x: this._po2.x + radius * Math.cos(angle),
			y: 0,
			z: this._po2.z + radius * Math.sin(angle)
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
	 * @param {Vector3} pp
	 * @param {number} radius
	 * @param {number} angle
	 * @returns {{x: number, y: number, z: number}}
	 * @private
	 */
	_calculatePositionQ(pp, radius, angle) {
		let a = {
			x: pp.x - radius * Math.cos(angle),
			y: 0,
			z: pp.z - radius * Math.sin(angle)
		};

		let b = {
			x: pp.x + radius * Math.cos(angle),
			y: 0,
			z: pp.z + radius * Math.sin(angle)
		};

		let distanceA = this._pd.distanceTo(a);
		let distanceB = this._pd.distanceTo(b);
		return distanceA < distanceB ? a : b;
	}

	/**
	 * Start calculate
	 *
	 * @returns {CalculateMoving}
	 */
	startCalculate() {
		HelperPoints.get().remove(1);

		let rad = Math.PI / 2;
		let direction = this._calculateAngleDirection();

		let rLeft = this._r;
		let pLeft = this._calculatePositionP(direction - rad, rLeft);
		let hLeft = this._calculateLengthH(pLeft);

		if (hLeft < rLeft) {
			rLeft = hLeft / 2;
			pLeft = this._calculatePositionP(direction - rad, rLeft);
			hLeft = this._calculateLengthH(pLeft);
		}

		let rRight = this._r;
		let pRight = this._calculatePositionP(direction + rad, rRight);
		let hRight = this._calculateLengthH(pRight);

		if (hRight < rRight) {
			rRight = hRight / 2;
			pRight = this._calculatePositionP(direction + rad, rRight);
			hRight = this._calculateLengthH(pRight);
		}

		let dLeft = Math.sqrt(hLeft * hLeft - rLeft * rLeft);
		let dRight = Math.sqrt(hRight * hRight - rRight * rRight);

		let angle;
		if (dLeft < dRight) {

			this._tempAngle = Math.acos(rLeft / hLeft);
			let x = this._pd.x - pLeft.x,
				z = this._pd.z - pLeft.z;

			angle = Math.atan(z / x) + this._tempAngle;
			this._tempSide = CalculateMoving.SIDE_LEFT;
			this._tempRadius = rLeft;
			this._pp.copy(pLeft);

		} else {

			this._tempAngle = Math.acos(rRight / hRight);
			let x = this._pd.x - pRight.x,
				z = this._pd.z - pRight.z;

			angle = Math.atan(z / x) - this._tempAngle;
			this._tempSide = CalculateMoving.SIDE_RIGHT;
			this._tempRadius = rRight;
			this._pp.copy(pRight);
		}

		this._pq.copy(this._calculatePositionQ(this._pp, this._tempRadius, angle));

		HelperPoints.get().add(this._pp, 1, 0xFFFFFF);
		HelperPoints.get().add(this._pd, 1, 0xFFFF00);
		HelperPoints.get().add(this._pq, 1, 0x0000FF);

		return this;
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
		// this._po2 = value;
		return this;
	}

	/**
	 *
	 * @returns {Vector3}
	 */
	get pp() {
		return this._pp;
	}

	/**
	 *
	 * @returns {Vector3}
	 */
	get pq() {
		return this._pq;
	}

	/**
	 * Get position motion to
	 *
	 * @param {Vector3} point
	 * @param {number} angle
	 * @param {number} far
	 * @returns {{ x: number, y: number, z: number }}
	 */
	static calcNextPosition(point, angle, far) {
		return {
			x: point.x + (far * Math.cos(angle)),
			y: 0,
			z: point.z + (far * Math.sin(angle))
		};
	}

	/**
	 *
	 * @param {number} deltaTime
	 * @param {(Mesh|Group)} object
	 * @returns {void}
	 */
	update(deltaTime, object) {
		let distance = this._speed * deltaTime;

		this._tempAngle += 0.01;
		let angle, angleAim;
		switch (this._tempSide) {
			case CalculateMoving.SIDE_LEFT:
				angle = - this._tempAngle;
				angleAim = angle - 0.02;
				break;
			case CalculateMoving.SIDE_RIGHT:
				angle = this._tempAngle;
				angleAim = angle + 0.02;
				break;
		}

		let a = CalculateMoving.calcNextPosition(this._pp, angle, this._tempRadius);
		let b = CalculateMoving.calcNextPosition(this._pp, angleAim, this._tempRadius);

		HelperPoints.get().add(a, 1, 0xFFFFFF);
		HelperPoints.get().add(b, 1, 0xFF00FF);





		// object.position.x = this._pp.x + this._tempRadius * Math.cos(angle);
		// object.position.z = this._pp.z + this._tempRadius * Math.sin(angle);

		// let p = CalculateMoving.calcNextPosition(this._pp, angle += 0.01, FAR);

		object.position.copy(a);
		object.lookAt(b);


	}
}

export default CalculateMoving;