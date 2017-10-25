import {PLANET_NAMES} from './map';

class Planet {
	/**
	 * This is key of planet
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
		this.name = PLANET_NAMES[key];

		/**
		 *
		 * @type {number}
		 */
		this.sixe = 10;
	}
}

export default Planet