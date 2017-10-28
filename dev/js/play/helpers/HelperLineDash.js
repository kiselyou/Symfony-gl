
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
		 * @type {Array.<{name: (string|number), lien: Line, points: Array.<Vector>}>}
		 * @private
		 */
		this._groups = [];

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._color = 0xFF0000;

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
		this._gapSize = 6;
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
	 * Add point
	 *
	 * @param {Vector3} point
	 * @param {number|string} groupName
	 * @returns {HelperLineDash}
	 */
	addPoint(point, groupName = 1) {
		this._addToGroup(groupName, point);
		return this;
	}

	/**
	 * Remove lines
	 *
	 * @param {(string|number)} groupName
	 * @returns {HelperLineDash}
	 */
	remove(groupName) {
		for (let i = 0; i < this._groups.length; i++) {
			let group = this._groups[i];
			if (group['name'] === groupName && group['line']) {
				this._initScene.remove(group['line']);
				this._groups.splice(i, 1);
				break;
			}
		}
		return this;
	}

	/**
	 * Draw lines
	 *
	 * @param {(string|number)} groupName
	 * @returns {HelperLineDash}
	 */
	draw(groupName) {

		let group = this._groups.find((item) => {
			return item['name'] === groupName;
		});

		if (!group) {
			this._createGroup(groupName);
			group = this._groups.find((item) => {
				return item['name'] === groupName;
			})
		}

		let material = new THREE.LineDashedMaterial({
			color: this._color,
			dashSize: this._dashSize,
			gapSize: this._gapSize,
			linewidth: 1,
		});

		let geometry = new THREE.Geometry();

		for (let point of group['points']) {
			geometry.vertices.push(point);
		}

		geometry.computeLineDistances();
		group['line'] = new THREE.Line(geometry, material);
		this._initScene.scene.add(group['line']);
		return this;
	}

	/**
	 * Add point to group
	 *
	 * @param {(string|number)} groupName
	 * @param {Vector3} point
	 * @private
	 */
	_addToGroup(groupName, point) {
		let group = this._groups.find((item) => {
			return item['name'] === groupName;
		});
		if (group) {
			group['points'].push(point);
		} else {
			this._createGroup(groupName, point);
		}
	}

	/**
	 * Create group lines
	 *
	 * @param {(string|number)} groupName
	 * @param {Vector3} [point]
	 * @private
	 */
	_createGroup(groupName, point = null) {
		this._groups.push({
			name: groupName,
			line: null,
			points: point ? [point] : []
		});
	}
}

export default HelperLineDash;