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
		 * @type {Group}
		 * @private
		 */
		this._flag = new THREE.Group();

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
		this._isPreparedAim = false;

		/**
		 * If is true the flag is prepared
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isPreparedFlag = false;

		/**
		 * If is true the aim is on the scene
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isAim = false;

		/**
		 * This is current size of aim
		 *
		 * @type {number}
		 * @private
		 */
		this._scale = 0.03;

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isFlag = false;
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
	 * Remove aim from scene
	 *
	 * @returns {PlayerAim}
	 */
	removeFlag() {
		if (this._isFlag) {
			this._initScene.remove(this._flag);
			this._isFlag = false;
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
		if (!this._isPreparedAim) {
			this._drawAim();
			this._isPreparedAim = true;
		}
		this._initScene.add(this._aim);
		this._isAim = true;
		return this;
	}

	/**
	 *
	 * @param {Vector3} position
	 * @returns {PlayerAim}
	 */
	setFlag(position) {
		this.removeFlag();
		this._flag.position.copy(position);
		if (!this._isPreparedFlag) {
			this._drawFlag();
			this._isPreparedFlag = true;
		}
		this._initScene.add(this._flag);
		this._isFlag = true;
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

	_drawFlag() {
		let geometryCylinder = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
		let materialCylinder = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		let cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
		cylinder.position.y = 4;
		this._flag.add(cylinder);

		let geometry = new THREE.SphereGeometry(1, 8, 8);
		let material = new THREE.MeshBasicMaterial({color: 0xffffff});
		let sphere = new THREE.Mesh(geometry, material);
		this._flag.add(sphere);

		this._flag.add(PlayerAim._drawFlag());
		this._flag.scale.set(0.5, 0.5, 0.5);
	}

	static _drawFlag() {
		let triangleShape = new THREE.Shape();
		let x = 0,
			y = 5.7;

		triangleShape.moveTo(x, y);
		triangleShape.lineTo(x + 3.5, y);
		triangleShape.lineTo(x + 5, y + 1);
		triangleShape.lineTo(x + 3.5, y + 2);
		triangleShape.lineTo(x, y + 2);
		triangleShape.lineTo(x, y);

		let geometry = new THREE.ShapeGeometry(triangleShape);
		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			overdraw: 0.5,
			side: THREE.DoubleSide
		});
		return new THREE.Mesh(geometry, material);
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