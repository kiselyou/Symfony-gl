
class Ship {
    constructor() {

        /**
         * This is mesh of model
         *
         * @type {?Mesh|Group}
         * @private
         */
        this._obj = null;
    }

    /**
     *
     * @param {Mesh|Group} value
     * @returns {Ship}
     */
    setObject(value) {
        this._obj = value;
        return this;
    }

	/**
	 *
	 * @param {(Vector3|{x: number, y: number, z: number})} value
	 * @returns {Ship}
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
     * @returns {Ship}
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

	/**
	 *
	 * @param {(Vector3|{x: number, y: number, z: number})} scale
	 * @returns {Station}
	 */
	setScale(scale) {
		this._obj.scale.copy(scale);
		return this;
	}
}

export default Ship;