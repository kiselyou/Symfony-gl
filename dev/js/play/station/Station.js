
class Station {
	constructor() {
		/**
		 * This is mesh of station
		 *
		 * @type {?Mesh|Group}
		 * @private
		 */
		this._obj = null;
	}

	/**
	 *
	 * @param {Mesh|Group} value
	 * @returns {Station}
	 */
	setObject(value) {
		this._obj = value;
		return this;
	}

	/**
	 *
	 * @param {(Vector3|{x: number, y: number, z: number})} value
	 * @returns {Station}
	 */
	lookAt(value) {
		this._obj.lookAt(value);
		return this;
	}

	/**
	 *
	 * @returns {Mesh|Group}
	 */
	getObject() {
		return this._obj;
	}

	/**
	 *
	 * @param {(Vector3|{x: number, y: number, z: number})} position
	 * @returns {Station}
	 */
	setPosition(position) {
		this._obj.position.copy(position);
		return this;
	}

	/**
	 *
	 * @returns {Vector3}
	 */
	getPosition() {
		return this._obj.position;
	}
}

export default Station;