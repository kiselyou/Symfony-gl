import * as THREE from 'three';

import {
	MODEL_EXPLORER,
} from './../../ini/obj.ini';

import {
	SECTOR_A
} from './../environment/sectors/map/map';

import PlayerKeyBoard from './PlayerKeyBoard';

class PlayerSettings {
	constructor() {

		/**
		 * @type {number}
		 */
		this.sectorKey = SECTOR_A;

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
		 * @type {number}
		 */
		this.speed = 100;

		/**
		 *
		 * @type {number}
		 */
		this.radius = 30;

        /**
		 *
         * @type {boolean}
         */
		this.girdHelperEnable = false;

		/**
		 * Show path to aim
		 *
		 * @type {boolean}
		 */
		this.showTargetPath = true;

		/**
		 *
		 * @type {PlayerKeyBoard}
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
		this.orbitMinDistance = 300;

		/**
		 *
		 * @type {Number}
		 */
		this.orbitMaxDistance = 800;

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