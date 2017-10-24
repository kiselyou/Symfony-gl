import * as THREE from 'three';

import {
	MODEL_EXPLORER,
} from './../../ini/obj.ini';

import PlayerKeyBoard from './PlayerKeyBoard';

class PlayerSettings {
	constructor() {

		/**
		 *
		 * @type {string}
		 */
		this.envPath = './src/img/skybox/003_space.jpg';

		/**
		 * This is position of model ship
		 *
		 * @type {{x: number, y: number, z: number}|Vector3}
		 */
		this.startPositionShip = new THREE.Vector3(0, 0, 0);

		/**
		 * @type {string}
		 */
		this.shipName = MODEL_EXPLORER;

        /**
		 *
         * @type {boolean}
         */
		this.girdHelperEnable = true;

		/**
		 * Show path to aim
		 *
		 * @type {boolean}
		 */
		this.showTargetPath = true;

		/**
		 *
		 * @type {PlayerKeyBoard}
		 * @private
		 */
		this.keyBoard = new PlayerKeyBoard();

		/**
		 *
		 * @type {boolean}
		 */
		this.orbitEnabled = true;

		/**
		 *
		 * @type {boolean}
		 */
		this.orbitEnablePan = false;

		/**
		 *
		 * @type {boolean}
		 */
		this.orbitEnableKeys = false;

		/**
		 *
		 * @type {boolean}
		 */
		this.orbitAutoRotate = false;

		/**
		 *
		 * @type {number}
		 */
		this.orbitMinDistance = 50;

		/**
		 *
		 * @type {Number}
		 */
		this.orbitMaxDistance = 300;

		/**
		 *
		 * @type {number}
		 */
		this.orbitMinPolarAngle = 0;

		/**
		 *
		 * @type {number}
		 */
		this.orbitMaxPolarAngle = Math.PI;
	}
}

export default PlayerSettings;