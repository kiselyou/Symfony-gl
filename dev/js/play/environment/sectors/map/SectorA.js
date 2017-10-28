import * as THREE from 'three';
import Sector from './Sector';
import PlanetEarth from './planets/PlanetEarth';
import {SECTOR_A} from './map';

class SectorA extends Sector {
	constructor() {
		super(SECTOR_A);

		/**
		 *
		 * @type {boolean}
		 */
		this.isDone = false;
	}

	/**
	 * Prepare sector
	 *
	 * @returns {SectorA}
	 */
	prepare() {
		if (!this.isDone) {
			this._prepareLight();
			this._preparePlanets();
			this.isDone = true;
		}
		return this;
	}

	/**
	 *
	 * @private
	 * @returns {void}
	 */
	_prepareLight() {
		let pointLight = new THREE.PointLight(0xFFFFFF, 1);
		pointLight.position.set(0, 200, -2000);
		this.lights.push(pointLight);
	}

	/**
	 *
	 * @private
	 * @returns {void}
	 */
	_preparePlanets() {
		let earth = new PlanetEarth();
		this.planets.push(earth);
	}
}

export default SectorA;