import * as THREE from 'three';
import Shader from './../../shaders/Shader';
import IMGLoader from '../loader/IMGLoader';


class SkyeBox {
	/**
	 *
	 * @param {Scene} scene
	 */
	constructor(scene) {

		/**
		 *
		 * @type {Scene}
		 * @private
		 */
		this._scene = scene;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._size = 20000;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._wSegments = 25;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._hSegments = 25;

		/**
		 *
		 * @type {?Mesh}
		 * @private
		 */
		this._environment = null;

		/**
		 *
		 * @type {IMGLoader}
		 * @private
		 */
		this._textureLoader = IMGLoader.get();

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isEnv = false;

		/**
		 *
		 * @type {?Mesh}
		 * @private
		 */
		this._plane = null;
	}

	/**
	 *
	 * @returns {number}
	 */
	get size() {
		return this._size;
	}

	/**
	 *
	 * @return {boolean}
	 */
	get isEnv() {
		return this._isEnv;
	}

	/**
	 *
	 * @param {Vector3} v
	 * @returns {SkyeBox}
	 */
	setPosition(v) {
		if (this._isEnv) {
			this._environment.position.set(v.x, 0, v.z);
			this._plane.position.set(v.x, 0, v.z);
		}
		return this;
	}

	/**
	 * Build sky box and add it to scene.
	 *
	 * @param {string} path
	 * @returns {SkyeBox}
	 */
	initEnv(path) {
		this.removeEnv();
		let material = new THREE.MeshStandardMaterial({
			map: this._textureLoader.find(path)
		});
		this._environment = new THREE.Mesh(new THREE.SphereGeometry(this._size, this._wSegments, this._hSegments), material);
		this._environment.material.side = THREE.BackSide;
		this._environment.material.depthWrite = false;
		this._environment.material.roughness = 0.30;
		this._environment.material.metalness = 0.10;
		this._buildPlane();
		this._scene.add(this._environment);
		this._isEnv = true;
		return this;
	}

	/**
	 * Remove SkyBox from the scene
	 *
	 * @returns {SkyeBox}
	 */
	removeEnv() {
		if (this._isEnv) {
			this._removePlane();
			this._scene.remove(this._environment);
			this._isEnv = false;
		}
		return this;
	}

	/**
	 *
	 * @returns {void}
	 * @private
	 */
	_buildPlane() {
		let geometry = new THREE.RingGeometry(1, this._size * 10, this._wSegments);
		let material = new THREE.MeshBasicMaterial({
			depthWrite: false,
			color: 0xFFFFFF,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0
		});
		this._plane = new THREE.Mesh(geometry, material);
		this._plane.rotation.x = Math.PI / 2;
		this._scene.add(this._plane);
	}

	/**
	 *
	 * @returns {void}
	 * @private
	 */
	_removePlane() {
		this._scene.remove(this._plane);
	}

	/**
	 * This is plane of environment
	 *
	 * @return {Mesh}
	 */
	get plane() {
		return this._plane;
	}
}

export default SkyeBox;