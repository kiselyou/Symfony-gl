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
		let hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1);
		hemisphereLight.position.set(2500, 200, -2000);
		
		// let hemiSphere = new THREE.HemisphereLightHelper(hemisphereLight, 15);
		
		this.lights.push(hemisphereLight);
		
		let directionalLight = new THREE.DirectionalLight(0xACBCFF, 0.2);
		directionalLight.position.set(2500, 200, 25000);
		this.lights.push(directionalLight);
		
		
		// let pointLight = new THREE.PointLight(0xFFFFFF, 0.1, 0, 2);
		// pointLight.castShadow = true;
		// // pointLight.power = 10;
		// pointLight.position.set(2500, 200, -2000);
		// this.lights.push(pointLight);
		
		
		// let light = new THREE.AmbientLight(0x404040, 0.5); // soft white light
		// light.position.set(20, 20, -20);
		// this.lights.push(light);
		
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