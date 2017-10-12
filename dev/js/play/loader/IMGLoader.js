import * as THREE from 'three';

let textureInst = null;

class IMGLoader {
	constructor() {

		/**
		 *
		 * @type {TextureLoader}
		 * @private
		 */
		this._loader = new THREE.TextureLoader();

		/**
		 *
		 * @type {Array}
		 */
		this._cache = {};
	}

	/**
	 * Get instance of IMGLoader
	 *
	 * @returns {IMGLoader}
	 */
	static get() {
		return textureInst || (textureInst = new IMGLoader());
	}

	/**
	 * Find texture or load
	 *
	 * @param {string} path
	 * @returns {*}
	 */
	find(path) {
		if (this._cache.hasOwnProperty(path)) {
			return this._cache[path];
		} else {
			let texture = this._loader.load(path);
			this._cache[path] = texture;
			return texture;
		}
	}
}

export default IMGLoader;