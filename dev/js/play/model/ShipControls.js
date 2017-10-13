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
	moveShip(target, sceneTest) {
		//TODO sceneTest remove
		this.pointTest(target, sceneTest);

		this._calculateMoving
			.setPositionDestination(target)
			.setAngleDirection(this.getDirection())
	        .setPositionOriginal(this.getPosition())
			.startCalculate();
		this.startMove();
	    return this;
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
	update(deltaTime, sceneTest) {
		//TODO sceneTest remove
		if (this._enableMoving) {
			// console.log(deltaTime, this.getObject());
			console.log(this._calculateMoving.pp);
			this.stopMove();






			this.pointTest(this._calculateMoving.pp, sceneTest);
		}
	}

	//TODO remove
	pointTest(position, sceneTest) {
		let geometry = new THREE.SphereGeometry(2, 15, 15);
		let material = new THREE.MeshBasicMaterial({color: 0xffffff});
		let mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(position);
		sceneTest.add(mesh);
	}
}

export default ShipControls;