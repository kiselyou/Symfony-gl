
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
	    // var direction = new THREE.Vector3( 0, 0, 1 );
	    // direction = matrix.multiplyVector3( direction );
	    // this.lookAt(this.getDirection());
        return this;
    }

	/**
	 *
	 * @param {Vector3} value
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
     * @param {Vector3|{x: number, y: number, z: number}} position
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
	 * @returns {Vector3}
	 */
	getDirection() {
		return this._obj.getWorldDirection();
	}
}

export default Ship;