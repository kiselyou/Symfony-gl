import * as THREE from 'three';

import HelperPoints from './../helpers/HelperPoints';
import HelperLineDash from '../helpers/HelperLineDash';

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
		this._speed = 50;

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
		 *
		 * @type {number}
		 * @private
		 */
		this._tempLineAngle = 0;

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

		/**
		 *
		 * @type {number} - Possible values (CalculateMoving.ACTION_STOP|CalculateMoving.ACTION_ARC|CalculateMoving.ACTION_DIRECT)
		 *                  0 - Stop
		 *                  1 - moving around arc
		 *                  2 - moving direct
		 * @private
		 */
		this._action = 0;

		// HelperPoints.get().add(this._po1, 1, 0x0F00FF);

		/**
		 * TODO: move it to another class
		 *
		 * @type {HelperLineDash}
		 * @private
		 */
		this._helperLine = new HelperLineDash();

	}

	/**
	 * Stop
	 *
	 * @returns {number}
	 */
	static get ACTION_STOP() {
		return 0;
	}

	/**
	 * Moving around arc
	 *
	 * @returns {number}
	 */
	static get ACTION_ARC() {
		return 1;
	}

	/**
	 * Moving direct
	 *
	 * @returns {number}
	 */
	static get ACTION_DIRECT() {
		return 2;
	}

	/**
	 *
	 * @returns {string}\
	 */
	static get SIDE_LEFT() {
		return 'left';
	}

	/**
	 *
	 * @returns {string}
	 */
	static get SIDE_RIGHT() {
		return 'right';
	}

	/**
	 * Get angle of model
	 *
	 * @param {Vector3} a - It is previous position
	 * @param {Vector3} b - It is current position
	 * @returns {number}
	 */
	static calculateAngle(a, b) {
		let v = new THREE.Vector3();
		v.subVectors(b, a);
		return Math.atan2(v.z, v.x);
	};

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

		this._action = CalculateMoving.ACTION_ARC;

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

			this._tempAngle = direction + rad;

			let theta = Math.acos(rLeft / hLeft);
			let x = this._pd.x - pLeft.x,
				z = this._pd.z - pLeft.z;

			angle = Math.atan(z / x) + theta;
			this._tempSide = CalculateMoving.SIDE_LEFT;
			this._tempRadius = rLeft;
			this._pp.copy(pLeft);

		} else {

			this._tempAngle = direction - rad;

			let theta = Math.acos(rRight / hRight);
			let x = this._pd.x - pRight.x,
				z = this._pd.z - pRight.z;

			angle = Math.atan(z / x) - theta;
			this._tempSide = CalculateMoving.SIDE_RIGHT;
			this._tempRadius = rRight;
			this._pp.copy(pRight);
		}

		this._pq.copy(this._calculatePositionQ(this._pp, this._tempRadius, angle));


		let x = this._pd.x - this._pq.x;
		let z = this._pd.z - this._pq.z;
		this._tempLineAngle = Math.atan2(z, x);

		// HelperPoints.get().add(this._po2, 1, 0xFFFFFF);
		// HelperPoints.get().add(this._pd, 1, 0xFFFF00);
		// HelperPoints.get().add(this._pq, 1, 0x0000FF);


		let groupName = 1;
		this._helperLine
			.setGapSize(4)
			.setDashSize(0.2)
			.remove(groupName)
			.addPoint(this._po2, groupName)
			.addPoint(this._pp, groupName)
			.addPoint(this._pq, groupName)
			.addPoint(this._pd, groupName)
			.draw(groupName);

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
		this._po2 = value;
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
	 * @param {number} angle
	 * @param {number} angleStep
	 * @returns {{curr: { x: number, y: number, z: number }, next: { x: number, y: number, z: number }, side: (CalculateMoving.SIDE_LEFT|CalculateMoving.SIDE_RIGHT)}}
	 * @private
	 */
	_calculateCircleStep(angle, angleStep) {
		switch (this._tempSide) {
			case CalculateMoving.SIDE_LEFT:
				return {
					curr: CalculateMoving.calcNextPosition(this._pp, angle - angleStep, this._tempRadius),
					next: CalculateMoving.calcNextPosition(this._pp, angle - angleStep * 2, this._tempRadius),
					side: CalculateMoving.SIDE_LEFT
				};
				break;
			case CalculateMoving.SIDE_RIGHT:
				return {
					curr: CalculateMoving.calcNextPosition(this._pp, angle + angleStep, this._tempRadius),
					next: CalculateMoving.calcNextPosition(this._pp, angle + angleStep * 2, this._tempRadius),
					side: CalculateMoving.SIDE_RIGHT
				};
				break;
		}
	}

	_updateTempAngle(side, speed) {
		side === CalculateMoving.SIDE_LEFT ? this._tempAngle -= speed : this._tempAngle += speed;
		return this;
	}

	/**
	 *
	 * @param {number} deltaTime
	 * @param {(Mesh|Group)} object
	 * @returns {void}
	 */
	update(deltaTime, object) {
		let distance;
		switch (this._action) {
			case CalculateMoving.ACTION_ARC:
				// remember last position
				this._po1.x = object.position.x;
				this._po1.z = object.position.z;

				distance = this._speed * deltaTime;
				let angleStep = distance / this._tempRadius;

				let circleStep = this._calculateCircleStep(this._tempAngle, angleStep);
				this._updateTempAngle(circleStep['side'], angleStep);

				object.position.copy(circleStep['curr']);

				let distanceToAim = this._pq.distanceTo(circleStep['next']);
				if (distanceToAim >= this._pq.distanceTo(circleStep['curr']) && distanceToAim < this._tempRadius) {
					console.log(
						1,
						this._pq.distanceTo(circleStep['next']),
						this._pq.distanceTo(circleStep['curr']),
						CalculateMoving.radiansToDegrees(this._tempAngle),

					);
					this._action = CalculateMoving.ACTION_DIRECT;
					object.lookAt(this._pd);
				} else {
					object.lookAt(circleStep['next']);
				}

				break;

			case CalculateMoving.ACTION_DIRECT:

				// remember last position
				this._po1.x = object.position.x;
				this._po1.z = object.position.z;

				distance = this._speed * deltaTime;

				object.position.x = object.position.x + distance * Math.cos(this._tempLineAngle);
				object.position.z = object.position.z + distance * Math.sin(this._tempLineAngle);

				let next = {
					x: object.position.x + (distance * 2) * Math.cos(this._tempLineAngle),
					y: 0,
					z: object.position.z + (distance * 2) * Math.sin(this._tempLineAngle)
				};

				if (this._pd.distanceTo(next) > this._pd.distanceTo(object.position)) {
					this._action = CalculateMoving.ACTION_STOP;
				}

				break;

		}
	}
}

export default CalculateMoving;