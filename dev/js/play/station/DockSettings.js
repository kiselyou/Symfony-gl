import * as THREE from 'three';

import {
	MODEL_DOCK_IA1
} from './../../ini/obj.ini';

class DockSettings {
	constructor() {

		/**
		 * This is dock name
		 *
		 * @type {string}
		 */
		this.name = MODEL_DOCK_IA1;

		/**
		 *
		 * @type {Vector3}
		 */
		this.scale = new THREE.Vector3(45, 45, 45);

		/**
		 *
		 * @type {Vector3}
		 */
		this.scaleShip = new THREE.Vector3(0.5, 0.5, 0.5);

		/**
		 *
		 * @type {boolean}
		 */
		this.orbitEnabled = true;

		/**
		 *
		 * @type {boolean}
		 */
		this.orbitAutoRotate = true;

		/**
		 *
		 * @type {number}
		 */
		this.orbitAutoRotateSpeed = 0.2;

		/**
		 *
		 * @type {number}
		 */
		this.orbitMinDistance = 800;

		/**
		 *
		 * @type {number}
		 */
		this.orbitMaxDistance = 800;

		/**
		 *
		 * @type {number}
		 */
		this.orbitMaxPolarAngle = Math.PI / 3;

		/**
		 *
		 * @type {number}
		 */
		this.orbitMinPolarAngle = Math.PI / 3;
	}
}

export default DockSettings;