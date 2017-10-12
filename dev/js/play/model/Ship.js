import ShipControls from './ShipControls';

class Ship extends ShipControls {
    constructor() {
        super();

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
}

export default Ship;