var IW = IW || {};

/**
 *
 * @param {IW.MultiLoader} multiLoader
 * @param {Scene} scene
 * @param {string} [id]
 * @constructor
 */
IW.Model = function ( multiLoader, scene, id ) {
    
    // Parent constructor
    IW.ModelParameters.call(this);

    /**
     *
     * @type {string}
     */
    this.id = id;

    /**
     * It is distance how far calculate position direct
     *
     * @type {number}
     */
    this.far = 1000;

    /**
     *
     * @type {Scene}
     */
    this.scene = scene;

    /**
     *
     * @type {?IW.ModelFly}
     */
    this.modelFly = new IW.ModelFly( this );

    /**
     *
     * @type {IW.MultiLoader}
     */
    this.multiLoader = multiLoader;

    /**
     *
     * @type {?IW.ModelShot}
     */
    this.modelShot = new IW.ModelShot( this );

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
    this.prev = new THREE.Vector3( 0, 0, - this.far );

    /**
     *
     * @private
     */
    this.model = null;

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
        return this.model;
    };

    /**
     *
     * @returns {?Vector3}
     */
    this.getPosition = function () {
        return this.model ? this.model.position : null;
    };

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {IW.Model}
     */
    this.addPosition = function (x, y, z) {
        this.model.position.x += x;
        this.model.position.y += y;
        this.model.position.z += z;
        return this;
    };

    /**
     *
     * @param {Vector3} v
     * @returns {IW.Model}
     */
    this.setPositionTo = function ( v ) {
        this.model.lookAt( v );
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
     * @param {Vector3} v
     * @returns {IW.Model}
     * @returns {IW.Model}
     */
    this.setPosition = function (v ) {
        if ( this.model ) {
            this.model.position.copy( v );
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
        if ( this.model ) {
            this.model.children[0].rotation.x = x;
            this.model.children[0].rotation.y = y;
            this.model.children[0].rotation.z = z;
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
        this.model.lookAt( new THREE.Vector3( x, y, z ) );
        return this;
    };

    /**
     *
     * @param {number} angle
     * @returns {IW.Model}
     */
    this.modelInclineZ = function (angle) {
        this.model.children[0].rotation.z = angle;
        return this;
    };

    /**
     * Load model
     *
     * @param {boolean} addToScene
     * @param {string} [str] - It is JSON data model
     * @returns {IW.Model}
     */
    this.load = function ( addToScene, str ) {

        if ( str ) {
            this.jsonToObject( str );
            this.model = this.multiLoader.getObject( this.name );
        } else {
            this.model = this.multiLoader.getObject( this.name );
            this.angle = startAngle( this.prev, this.model.position );
        }

        if ( addToScene ) {
            this.scene.add( this.model );
        }

        return this;
    };

    /**
     *
     * @param {function} [callback]
     * @return {IW.Model}
     */
    this.fly = function ( callback ) {
        this.modelFly.setEventKeyboard( callback );
        return this;
    };

    /**
     * Change model
     *
     * @param {string} name - It is JSON data model
     * @returns {IW.Model}
     */
    this.changeModel = function ( name ) {
        this.name = name;
        this.model = this.multiLoader.getObject( name );
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
        var except = [ 'model', 'modelFly', 'scene', 'multiLoader', 'modelShot', 'keyboard', 'positionTo' ];
        return _parentObjectToJSON.call( this, except );
    };

    /**
     *
     * @param {number} delta
     */
    this.update = function ( delta ) {

        this.modelFly.update( delta );
        this.modelShot.update( delta );
    }
};