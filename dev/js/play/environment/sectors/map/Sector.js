import {SECTOR_NAMES, SKY_BOX_PATH} from './map';

class Sector {
	/**
	 * This is key of sector
	 *
	 * @param {number} key
	 */
	constructor(key) {
		/**
		 *
		 * @type {number}
		 */
		this.key = key;

		/**
		 *
		 * @type {string}
		 */
		this.name = SECTOR_NAMES[key];

		/**
		 *
		 * @type {string}
		 */
		this.skyBoxPath = SKY_BOX_PATH[key];

		/**
		 *
		 * @type {Array.<Planet>}
		 */
		this.planets = [];

		/**
		 *
		 * @type {Array.<PointLight|DirectionalLight|HemisphereLight>}
		 */
		this.lights = [];
	}

	/**
	 * Add planets to scene
	 *
	 * @param {Scene|Mesh|Group} element
	 * @returns {Sector}
	 */
	addTo(element) {
		for (let planet of this.planets) {
			planet.addTo(element);
		}
		return this;
	}

	/**
	 * Add planets to scene
	 *
	 * @param {Scene|Mesh|Group} element
	 * @returns {Sector}
	 */
	removeFrom(element) {
		for (let planet of this.planets) {
			planet.removeFrom(element);
		}
		return this;
	}

	/**
	 *
	 * @param {number} deltaTime
	 * @returns {void}
	 */
	update(deltaTime) {
		for (let planet of this.planets) {
			planet.update(deltaTime);
		}
	}

	/**
	 * Abstract method
	 *
	 * @returns {Sector}
	 */
	prepare() {
		return this;
	}
}

export default Sector;