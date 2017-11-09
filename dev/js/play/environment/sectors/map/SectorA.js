import * as THREE from 'three';
import Sector from './Sector';
import PlanetSun from './planets/PlanetSun';
import PlanetEarth from './planets/PlanetEarth';
import PlanetMoon from './planets/PlanetMoon';
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
		let hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1);

		// hemisphereLight.intensity = 0.3;
		hemisphereLight.position.set(2500, 200, -2000);
		this.lights.push(hemisphereLight);
		
		
		// let pointLight = new THREE.PointLight(0xFFFFFF, 0.1, 0, 2);
		// pointLight.castShadow = true;
		// // pointLight.power = 10;
		// pointLight.position.set(2500, 200, -2000);
		// this.lights.push(pointLight);
	}

	/**
	 *
	 * @private
	 * @returns {void}
	 */
	_preparePlanets() {

		let earth = new PlanetEarth();
		
		let moon = new PlanetMoon();
		earth.addChildren(moon);
		
		let sun = new PlanetSun();
		sun.addChildren(earth);

		this.planets.push(sun);
		// this.planets.push(earth);
	}
}

export default SectorA;