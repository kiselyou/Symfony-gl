
import * as THREE from 'three';
import InitScene from './../scene/InitScene';

class HelperLineDash {
	constructor() {

		/**
		 *
		 * @type {InitScene}
		 * @private
		 */
		this._initScene = InitScene.get();

		/**
		 *
		 * @type {?Line}
		 * @private
		 */
		this._line = null;

		/**
		 *
		 * @type {Array}
		 * @private
		 */
		this._points = [];

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._color = 0xFFFFFF;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._dashSize = 2;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._gapSize = 3;
	}

	/**
	 *
	 * @param {number} value
	 * @returns {HelperLineDash}
	 */
	setColor(value) {
		this._color = value;
		return this;
	}

	/**
	 *
	 * @param {number} value
	 * @returns {HelperLineDash}
	 */
	setDashSize(value) {
		this._dashSize = value;
		return this;
	}

	/**
	 *
	 * @param {number} value
	 * @returns {HelperLineDash}
	 */
	setGapSize(value) {
		this._gapSize = value;
		return this;
	}

	/**
	 *
	 * @param {Vector3} point
	 * @returns {HelperLineDash}
	 */
	add(point) {
		this._points.push(point);
		return this;
	}

	/**
	 *
	 * @returns {HelperLineDash}
	 */
	remove() {
		if (this._line) {
			this._initScene.scene.remove(this._line);
			this._points.splice(0, this._points.length);
			this._line = null;
		}
		return this;
	}

	/**
	 *
	 * @returns {HelperLineDash}
	 */
	draw() {
		let material = new THREE.LineDashedMaterial({
			color: this._color,
			dashSize: this._dashSize,
			gapSize: this._gapSize
		});
		let geometry = new THREE.Geometry();

		for (let point of this._points) {
			geometry.vertices.push(point);
		}

		geometry.computeLineDistances();
		this._line = new THREE.Line(geometry, material);
		this._initScene.scene.add(this._line);
		return this;
	}
}

export default HelperLineDash;