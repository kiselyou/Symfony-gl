
import * as THREE from 'three';
import InitScene from './../scene/InitScene';

let helper = null;

class HelperPoints {
	constructor() {
		/**
		 *
		 * @type {Array.<Mesh>}
		 * @private
		 */
		this._points = [];

		/**
		 *
		 * @type {InitScene}
		 * @private
		 */
		this._initScene = InitScene.get();
	}

	/**
	 *
	 * @returns {*|HelperPoints}
	 */
	static get() {
		return helper || (helper = new HelperPoints());
	}

	/**
	 *
	 * @param {(Vector3|{x: number, y: number, z: number})} position
	 * @param {(string|number)} [group] - name of group points
	 * @param {number} [color]
	 * @param {number} [size]
	 * @returns {HelperPoints}
	 */
	add(position, group = 1, color = 0xff0000, size = 1) {
		let geometry = new THREE.SphereGeometry(size, 15, 15);
		let material = new THREE.MeshBasicMaterial({color: color});
		let mesh = new THREE.Mesh(geometry, material);
		this._addToGroup(group, mesh);
		mesh.position.copy(position);
		this._initScene.add(mesh);
		return this;
	}

	/**
	 *
	 * @param {(string|number)} groupName - name of group points
	 * @returns {HelperPoints}
	 */
	remove(groupName) {
		for (let i = 0; i < this._points.length; i++) {
			let group = this._points[i];
			if (group['name'] === groupName) {
				for (let mesh of group['elements']) {
					this._initScene.remove(mesh);
				}
				this._points.splice(i, 1);
				break;
			}
		}
		return this;
	}

	/**
	 *
	 * @param {(string|number)} groupName
	 * @param {Mesh} mesh
	 * @private
	 */
	_addToGroup(groupName, mesh) {
		let group = this._points.find((item) => {
			return item['name'] === groupName;
		});
		if (group) {
			group['elements'].push(mesh);
		} else {
			this._points.push({
				name: groupName,
				elements: [mesh]
			});
		}
	}
}

export default HelperPoints;