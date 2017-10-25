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
	 *
	 * @returns {Sector}
	 */
	prepare() {
		return this;
	}
}

export default Sector;