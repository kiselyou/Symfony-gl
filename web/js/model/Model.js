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
     * It is position model
     *
     * @type {{x: number, y: number, z: number}}
     */
    this.position = {
        x: 0,
        y: 0,
        z: 0
    };

    /**
     * It is position model
     *
     * @type {{x: number, y: number, z: number}}
     */
    this.positionTo = {
        x: 0,
        y: 0,
        z: 0
    };

    /**
     * Rotation model around axis XYZ
     *
     * @type {{x: number, y: number, z: number}}
     */
    this.rotation = {
        x: 0,
        y: 0,
        z: 0
    };

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
    var _prev = new THREE.Vector3( 0, 0, -1000 );

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
        this.positionTo.x += v.x;
        this.positionTo.y += v.y;
        this.positionTo.z += v.z;
        return this;
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
        this.position.x = _model.position.x;
        this.position.y = _model.position.y;
        this.position.z = _model.position.z;

        this.rotation.x = _model.children[0].rotation.x;
        this.rotation.y = _model.children[0].rotation.y;
        this.rotation.z = _model.children[0].rotation.z;

        return _parentObjectToJSON.call( this, [ 'model' ] );
    };
};