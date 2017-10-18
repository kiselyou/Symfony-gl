import * as THREE from 'three';
import InitScene from './../scene/InitScene';

class PlayerAim {
	constructor() {

		/**
		 *
		 * @type {InitScene}
		 * @private
		 */
		this._initScene = InitScene.get();

		/**
		 *
		 * @type {Group}
		 * @private
		 */
		this._aim = new THREE.Group();

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._countOfArrow = 6;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._radius = 10;

		/**
		 * This is center of aim
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._center = new THREE.Vector3(0, 0, 0);

		/**
		 * This is axis to incline arrow
		 *
		 * @type {Vector3}
		 * @private
		 */
		this._axis = new THREE.Vector3(1, 0, 0);

		/**
		 * If is true the aim is prepared
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isPrepared = false;

		/**
		 * If is true the aim is on the scene
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isAim = false;

		/**
		 * This is min size of aim
		 *
		 * @type {number}
		 * @private
		 */
		this._min = 0.02;

		/**
		 * This is max size of aim
		 *
		 * @type {number}
		 * @private
		 */
		this._max = 0.05;

		/**
		 * This is current size of aim
		 *
		 * @type {number}
		 * @private
		 */
		this._scale = 0.05;

		/**
		 * It is direction scale
		 *
		 * @type {number} - possible values (0|1)
		 * @private
		 */
		this._directionScale = 0;
	}

	/**
	 * Remove aim from scene
	 *
	 * @returns {PlayerAim}
	 */
	removeAim() {
		if (this._isAim) {
			this._initScene.remove(this._aim);
			this._isAim = false;
		}
		return this;
	}

	/**
	 * Sets aim
	 *
	 * @param {Vector3} position
	 * @returns {PlayerAim}
	 */
	setAim(position) {
		this.removeAim();
		this._aim.position.copy(position);
		if (!this._isPrepared) {
			this._drawAim();
			this._isPrepared = true;
		}
		this._initScene.add(this._aim);
		this._isAim = true;
		return this;
	}

	/**
	 * Build aim
	 *
	 * @private
	 */
	_drawAim() {
		let i = 0,
			x = 0,
			z = 0,
			angle = 0,
			half = Math.PI / 2,
			step = Math.PI * 2 / this._countOfArrow;

		while (i < this._countOfArrow) {
			x = this._center.x + this._radius * Math.cos(angle);
			z = this._center.z + this._radius * Math.sin(angle);
			let mesh = PlayerAim._drawArrow();
			mesh.position.set(x, 0, z);
			mesh.lookAt(this._center);
			mesh.rotateOnAxis(this._axis, -half);
			this._aim.add(mesh);
			angle += step;
			i++;
		}

		this._aim.scale.set(this._scale, this._scale, this._scale);
	}

	/**
	 * @returns {void}
	 */
	update() {
		if (this._directionScale === 0) {
			this._scale -= 0.001;
		} else {
			this._scale += 0.001;
		}
		if (this._scale > this._max) {
			this._directionScale = 0;
		}

		if (this._scale <= this._min) {
			this._directionScale = 1;
		}
		this._aim.scale.set(this._scale, this._scale, this._scale);
	}

	/**
	 *
	 * @returns {Mesh}
	 * @private
	 */
	static _drawArrow() {
		let w = 30 / 2; // 30 - it is width of arrow
		let l = 50 / 2; // 50 - it is length of arrow
		let tw = 10; 	// 10 - distance from side arrow to tail
		let tl = 40; 	// 45 - it is tail length
		let x = 0,
			y = 0;

		let triangleShape = new THREE.Shape();
		triangleShape.moveTo(x, y);
		triangleShape.lineTo(x + w, y + l);
		triangleShape.lineTo(x + tw, y + l);
		triangleShape.lineTo(x + tw, y + tl);
		triangleShape.lineTo(x - tw, y + tl);
		triangleShape.lineTo(x - tw, y + l);
		triangleShape.lineTo(x - w, y + l);
		triangleShape.moveTo(x, y);

		let geometry = new THREE.ShapeGeometry(triangleShape);
		let material = new THREE.MeshBasicMaterial({
			color: 0xFF0000,
			overdraw: 0.5,
			side: THREE.DoubleSide
		});
		return new THREE.Mesh(geometry, material);
	}
}

export default PlayerAim;