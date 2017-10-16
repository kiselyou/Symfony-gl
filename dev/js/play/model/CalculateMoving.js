import * as THREE from 'three';
import HelperLineDash from './../helpers/HelperLineDash';

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

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._enableMoving = false;

		/**
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
	static angleDirection(a, b) {
		return Math.atan2(b.z - a.z, b.x - a.x);
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

		let rad = Math.PI / 2,
			direction = CalculateMoving.angleDirection(this._po1, this._po2);

		let rLeft = this._r,
			pLeft = this._calculatePositionP(direction - rad, rLeft),
			hLeft = this._calculateLengthH(pLeft);

		if (hLeft < rLeft) {
			rLeft = hLeft / 2;
			pLeft = this._calculatePositionP(direction - rad, rLeft);
			hLeft = this._calculateLengthH(pLeft);
		}

		let rRight = this._r,
			pRight = this._calculatePositionP(direction + rad, rRight),
			hRight = this._calculateLengthH(pRight);

		if (hRight < rRight) {
			rRight = hRight / 2;
			pRight = this._calculatePositionP(direction + rad, rRight);
			hRight = this._calculateLengthH(pRight);
		}

		let dLeft = Math.sqrt(hLeft * hLeft - rLeft * rLeft),
			dRight = Math.sqrt(hRight * hRight - rRight * rRight),
			angle;

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
		this._tempLineAngle = CalculateMoving.angleDirection(this._pq, this._pd);
		return this;
	}

	/**
	 * Use this method after "startCalculate" to get correct line
	 *
	 * @returns {CalculateMoving}
	 */
	drawDashLine() {
		let groupName = 1;
		this._helperLine
			.remove(groupName)
			.addPoint(this._po2, groupName);

		this.calculateCirclePoints((point) => {
			this._helperLine.addPoint(new THREE.Vector3(point.x, point.y, point.z), groupName);
		});

		this._helperLine
			.addPoint(this._pd, groupName)
			.draw(groupName);

		return this;
	}

	/**
	 * Start move object. Use this method after "startCalculate" to get correct path
	 * To set moving of object you need use method "update" inside render
	 *
	 * @returns {CalculateMoving}
	 */
	startMoving() {
		this._enableMoving = true;
		return this;
	}

	/**
	 * Stop move object.
	 * To set moving of object you need use method "update" inside render
	 *
	 * @returns {CalculateMoving}
	 */
	stopMoving() {
		this._enableMoving = false;
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
	 * side: CalculateMoving.SIDE_LEFT|CalculateMoving.SIDE_RIGHT
	 * curr: Current position
	 * next: Next Position
	 *
	 * @param {number} angle
	 * @param {number} angleStep
	 * @returns {{curr: { x: number, y: number, z: number }, next: { x: number, y: number, z: number }, side: (string|number)}}
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

	/**
	 *
	 * @param {(string|number)} side - (CalculateMoving.SIDE_LEFT|CalculateMoving.SIDE_RIGHT)
	 * @param {number} speed
	 * @returns {CalculateMoving}
	 * @private
	 */
	_updateTempAngle(side, speed) {
		side === CalculateMoving.SIDE_LEFT ? this._tempAngle -= speed : this._tempAngle += speed;
		return this;
	}

	/**
	 * Gets calculated circle point
	 *
	 * @param {{ x: number, y: number, z: number }}
	 * @callback pointCircleListener
	 */

	/**
	 * Calculate circle points
	 *
	 * @param {pointCircleListener} listener
	 * @param {number} [intensity]
	 * @param {number} [maxIteration]
	 * @returns {void}
	 */
	calculateCirclePoints(listener, intensity = 0.1, maxIteration = 1000) {
		let distance = this._speed * intensity,
			angleStep = distance / this._tempRadius,
			tempAngle = this._tempAngle,
			circleStep,
			distanceToAim;

		let i = 0;

		do {
			circleStep = this._calculateCircleStep(tempAngle, angleStep);
			circleStep.side === CalculateMoving.SIDE_LEFT ? tempAngle -= angleStep : tempAngle += angleStep;
			distanceToAim = this._pq.distanceTo(circleStep.next);

			i++;
			if (i === maxIteration) {
				console.warn('The number of points of a circle is exceeded. Look at class CalculateMoving method calculateCirclePoints()');
				break;
			}

			if (distanceToAim >= this._pq.distanceTo(circleStep.curr) && distanceToAim < this._tempRadius) {
				break;
			} else {
				listener(circleStep.curr);
			}

		} while (1 === 1);
	}

	/**
	 * User this method to move object
	 *
	 * @param {number} deltaTime - This spent time
	 * @param {Object} object - This is (Mesh|Group) of object
	 * @returns {void}
	 */
	update(deltaTime, object) {
		if (!this._enableMoving) {
			return;
		}

		let distance = this._speed * deltaTime;
		switch (this._action) {
			case CalculateMoving.ACTION_ARC:
				// remember last position
				this._po1.x = object.position.x;
				this._po1.z = object.position.z;

				//TODO rewrite this data to calculated points from method "calculateCirclePoints()"
				// calculate arc
				let angleStep = distance / this._tempRadius;
				let circleStep = this._calculateCircleStep(this._tempAngle, angleStep);
				this._updateTempAngle(circleStep['side'], angleStep);

				object.position.copy(circleStep['curr']);

				let distanceToAim = this._pq.distanceTo(circleStep['next']);
				if (distanceToAim >= this._pq.distanceTo(circleStep['curr']) && distanceToAim < this._tempRadius) {
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
				// calculate straight
				object.position.x = object.position.x + distance * Math.cos(this._tempLineAngle);
				object.position.z = object.position.z + distance * Math.sin(this._tempLineAngle);

				let next = {
					x: object.position.x + (distance * 2) * Math.cos(this._tempLineAngle),
					y: 0,
					z: object.position.z + (distance * 2) * Math.sin(this._tempLineAngle)
				};

				if (this._pd.distanceTo(next) > this._pd.distanceTo(object.position)) {
					this._action = CalculateMoving.ACTION_STOP;
					this.stopMoving();
				}

				break;

		}
	}
}

export default CalculateMoving;