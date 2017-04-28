var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Model = function () {
    
    // Parent constructor
    IW.ModelParameters.call(this);

    this.id = null;

    /**
     * It is distance how far calculate position direct
     *
     * @type {number}
     */
    this.far = 1000;

    /**
     * It is position model
     *
     * @type {Vector3}
     */
    this.positionTo = new THREE.Vector3( 0, 0, this.far );

    /**
     *
     * @type {{fly: {forward: {keyName: string, keyCode: number}, left: {keyName: string, keyCode: number}, right: {keyName: string, keyCode: number}, backward: {keyName: string, keyCode: number}}}}
     */
    this.keyboard = {
        fly: {
            forward: {
                keyName: 'up arrow',
                keyCode: 38
            },
            left: {
                keyName: 'left arrow',
                keyCode: 37
            },
            right: {
                keyName: 'right arrow',
                keyCode: 39
            },
            backward: {
                keyName: 'down arrow',
                keyCode: 40
            }
        }
    };

    /**
     *
     * @type {Vector3}
     * @private
     */
    var _prev = new THREE.Vector3( 0, 0, - this.far );

    /**
     *
     * @private
     */
    var _model = null;

    /**
     *
     * @param {Vector3} a
     * @param {Vector3} b
     * @returns {number}
     */
    function startAngle( a, b ) {

        var v = new THREE.Vector3();
        v.subVectors( b, a );
        return Math.atan2( v.z, v.x );
    }

    /**
     *
     * @returns {?Mesh}
     */
    this.getModel = function () {
        return _model;
    };

    /**
     *
     * @returns {?Vector3}
     */
    this.getPosition = function () {
        return _model ? _model.position : null;
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {IW.Model}
     */
    this.addPosition = function (x, y, z) {
        _model.position.x += x;
        _model.position.y += y;
        _model.position.z += z;
        return this;
    };

    /**
     *
     * @param {Vector3} v
     * @returns {IW.Model}
     */
    this.setPositionTo = function ( v ) {
        _model.lookAt( v );
        this.positionTo.copy( v );
        return this;
    };

    /**
     *
     * @returns {Vector3}
     */
    this.getPositionTo = function () {
        return this.positionTo;
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {IW.Model}
     */
    this.setPosition = function ( x, y, z ) {
        if ( _model ) {
            _model.position.x = x;
            _model.position.y = y;
            _model.position.z = z;
        }
        return this;
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {IW.Model}
     */
    this.setRotation = function ( x, y, z ) {
        if ( _model ) {
            _model.children[0].rotation.x = x;
            _model.children[0].rotation.y = y;
            _model.children[0].rotation.z = z;
        }
        return this;
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {IW.Model}
     */
    this.lookAt = function ( x, y, z ) {
        _model.lookAt( new THREE.Vector3( x, y, z ) );
        return this;
    };

    /**
     *
     * @param {number} angle
     * @returns {IW.Model}
     */
    this.modelInclineZ = function (angle) {
        _model.children[0].rotation.z = angle;
        return this;
    };

    /**
     * Load model
     *
     * @param {IW.MultiLoader} multiLoader
     * @param {string} [str] - It is JSON data model
     * @returns {IW.Model}
     */
    this.load = function ( multiLoader, str ) {
        if ( str ) {
            this.jsonToObject( str );
            _model = multiLoader.getObject( this.name );
        } else {
            _model = multiLoader.getObject( this.name );
            this.angle = startAngle( _prev, _model.position );
        }

        return this;
    };

    /**
     * Change model
     *
     * @param {IW.MultiLoader} multiLoader
     * @param {string} name - It is JSON data model
     * @returns {IW.Model}
     */
    this.changeModel = function ( multiLoader, name ) {
        this.name = name;
        _model = multiLoader.getObject( name );
        return this;
    };

    /**
     * Parent method
     */
    var _parentObjectToJSON = this.objectToJSON;

    /**
     * Get json string of current object
     *
     * @return {string}
     */
    this.objectToJSON = function () {
        return _parentObjectToJSON.call( this, [ 'model' ] );
    };
};