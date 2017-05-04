var IW = IW || {};

/**
 *
 * @param {IW.MultiLoader} multiLoader
 * @param {Scene} scene
 * @param {string} [id]
 * @constructor
 * @augments ModelParameters
 */
IW.Model = function ( multiLoader, scene, id ) {
    
    // Parent constructor
    IW.ModelParameters.call(this);

    /**
     *
     * @type {string}
     */
    this.id = id ? id : THREE.Math.generateUUID();

    /**
     * It is distance how far calculate position direct
     *
     * @type {number}
     */
    this.far = 500;

    /**
     *
     * @type {Scene}
     */
    this.scene = scene;

    /**
     * Object IW.MultiLoader
     *
     * @type {IW.MultiLoader}
     */
    this.multiLoader = multiLoader;

    /**
     * Object IW.ModelFly
     *
     * @type {IW.ModelFly}
     */
    this.modelFly = new IW.ModelFly( this );

    /**
     * Object IW.Collision
     *
     * @type {IW.Collision}
     */
    this.collision = new IW.Collision( this );

    /**
     * Object IW.ModelShot
     *
     * @type {IW.ModelShot}
     */
    this.modelShot = new IW.ModelShot( this );

    /**
     * It is current position of model
     *
     * @type {Vector3}
     */
    this.position = new THREE.Vector3( 0, 0, 0 );

    /**
     * It is position of point where model will be moving
     *
     * @type {Vector3}
     */
    this.positionTo = new THREE.Vector3( 0, 0, this.far );

    /**
     * It is previous position of model
     *
     * @type {Vector3}
     * @private
     */
    this.prev = new THREE.Vector3( 0, 0, - this.far );

    /**
     * It is mesh of model
     *
     * @type{?THREE.Mesh}
     */
    this.model = null;

    /**
     * List models of clients
     *
     * @type {Array.<IW.Model>}
     */
    this.clientsModel = [];

    /**
     * Get angle of model
     *
     * @param {Vector3} a - It is previous position
     * @param {Vector3} b - It is current position
     * @returns {number}
     */
    this.getAngle = function ( a, b ) {
        var v = new THREE.Vector3();
        v.subVectors( b, a );
        return Math.atan2( v.z, v.x );
    };

    /**
     * Get mesh of model
     *
     * @returns {?THREE.Mesh}
     */
    this.getModel = function () {
        return this.model;
    };

    /**
     * Set position of point where will be moving model
     *
     * @param {Vector3|{x: number, y: number, z: number}} v
     * @returns {IW.Model}
     */
    this.setPositionTo = function ( v ) {
        this.lookAt( v );
        this.positionTo.copy( v );
        return this;
    };

    /**
     * Get position of point where will be moving model
     *
     * @returns {Vector3}
     */
    this.getPositionTo = function () {
        return this.positionTo;
    };

	/**
     * Get position model
	 *
	 * @returns {Vector3}
	 */
	this.getPosition = function () {
		return this.position;
	};

	/**
     * Increase model position
	 *
	 * @param {Vector3|{x: number, y: number, z: number}} v
	 * @returns {IW.Model}
	 */
	this.addPosition = function ( v ) {
		this.prev.copy( this.position );
		this.position.x += v.x;
		this.position.y += v.y;
		this.position.z += v.z;
		return this;
	};

    /**
     * Set position of model
     *
     * @param {Vector3|{x: number, y: number, z: number}} v
     * @returns {IW.Model}
     */
    this.setPosition = function ( v ) {
        if ( this.model ) {
	        this.position.copy( v );
        }
        return this;
    };

    /**
     * WARNING: Change arguments
     * This method is setting direction of model
     *
     * @param {Vector3|{x: number, y: number, z: number}} v
     * @returns {IW.Model}
     */
    this.lookAt = function ( v ) {
        this.model.lookAt( v );
        return this;
    };

    /**
     * WARNING: Added argument axis. Need change everywhere places. Rename method from "modelInclineZ" to "modelIncline"
     * This method set angle of incline model
     *
     * @param {string} axis
     * @param {number} angle
     * @returns {IW.Model}
     */
    this.modelIncline = function ( axis, angle ) {
        this.model.children[0]['rotation'][axis] = angle;
        return this;
    };

    /**
     * Loads model and set necessary parameters
     *
     * @param {boolean} addToScene - If true model will be added to scene
     * @param {string} [json] - It is JSON data model
     * @returns {IW.Model}
     */
    this.load = function ( addToScene, json ) {
        if ( json ) {
            this.jsonToObject( json );
            this.model = this.multiLoader.getObject( this.name );
        } else {
            this.model = this.multiLoader.getObject( this.name );
            this.angle = this.getAngle( this.prev, this.getPosition() );
        }

        this.model[ 'name' ] = this.id;
	    this.position = this.model.position;

        if ( addToScene ) {
            this.scene.add( this.model );
        }

        return this;
    };

    /**
     * WARNING: Need Rename this method
     * This method adds fly control to this model
     *
     * @param {function} [callback]
     * @return {IW.Model}
     */
    this.fly = function ( callback ) {
        this.modelFly.setEventKeyboard( callback );
        return this;
    };

    /**
     * WARNING: This method are not using yet
     * Change model of user
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
     * WARNING: This method move to class ModelControl
     * Add client
     *
     * @param {IW.Model} model
     * @return {IW.Model}
     */
    this.addClientModel = function ( model ) {
        this.clientsModel.push( model );
        this.collision.addObjectCollision( model.id );
        return this;
    };

    /**
     * Find model of client
     *
     * @param {(string|number)} id
     * @param {function} callback
     * @param {function} [error]
     * @return {IW.Model}
     */
    this.findClientModel = function ( id, callback, error ) {
        var clientModel = this.clientsModel.find(function ( value ) {
            return value.id === id;
        });

        if ( clientModel ) {
            callback.call( this, clientModel );
        } else {
            if (error) {
                error.call(this);
            }
        }

        return this;
    };

    /**
     * Remove current model
     *
     * @return {IW.Model}
     */
    this.removeModel = function () {
        this.scene.remove( this.scene.getObjectByName( this.id ) );
	    this.modelShot.destroyShots();
        this.model = null;
        return this;
    };

    /**
     * Remove model are using effects
     *
     * @return {IW.Model}
     */
    this.destroyModel = function () {
	    this.removeModel();
    };

    /**
     * Remove client model
     *
     * @return {IW.Model}
     */
    this.removeClientModel = function ( id ) {
        for ( var c = 0; c < this.clientsModel.length; c++ ) {
            if ( this.clientsModel[ c ][ 'id' ] === id ) {
                this.clientsModel[ c ].removeModel();
                this.clientsModel.splice( c, 1 );
                break;
            }
        }
    };

    /**
     * Remove client model are using effects
     *
     * @return {IW.Model}
     */
    this.destroyClientModel = function ( id ) {
	    this.removeClientModel( id );
    };

    /**
     * Sets data from json string
     *
     * @param {string} str - It is json string of IW.Model
     * @return {IW.Model}
     */
    this.jsonToObject = function ( str ) {
        try {
            var _object = JSON.parse( str );
            var vector = ['position', 'positionTo', 'prev'];
            for ( var property in _object ) {
                if ( _object.hasOwnProperty( property ) ) {
                    if ( vector.indexOf( property ) > -1 ) {
                        this[property].copy( _object[property] );
                    } else {
                        this[property] = _object[property];
                    }
                }
            }
        } catch ( e ) {
            console.warn( 'The model data is not correct' );
        }
        return this;
    };

    /**
     * Gets json string of current object
     *
     * @return {string}
     */
    this.objectToJSON = function () {
        var except = [
            'model',
            'scene',
            'modelFly',
            'multiLoader',
            'modelShot',
            'keyboard',
            'clientsModel',
            'collision'
        ];

        var object = {};
        for ( var property in this ) {
            if ( this.hasOwnProperty(property) || except.indexOf( property ) === -1 ) {
                object[ property ] = this[ property ];
            }
        }
        return JSON.stringify( object );
    };

	/**
     * Get string parameters of model from object
	 *
	 * @param {[]} properties
	 * @return {string}
	 */
	this.paramsToJSON = function ( properties ) {
		var params = {};
		for ( var property in properties) {
			if ( properties.hasOwnProperty( property ) ) {
				params[ property ] = properties[ property ];
			}
		}
		return JSON.stringify( params );
	};

	/**
     * Set parameters of model from string
	 *
	 * @param {string} json
	 * @return {IW.Model}
	 */
	this.paramsJSONToObject = function ( json ) {
		try {
			var properties = JSON.parse( json );
			for ( var property in properties) {
				if ( properties.hasOwnProperty( property ) ) {
					this[ property ] = properties[ property ];
				}
			}
		} catch ( e ) {
			console.warn( 'The params of model are not correct' );
		}
		return this;
	};

    /**
     * Update information of current model
     *
     * @param {number} delta
     */
    this.update = function ( delta ) {
        this.modelFly.update( delta );
        this.modelShot.update( delta );
        for ( var i = 0; i < this.clientsModel.length; i++ ) {
            this.clientsModel[ i ].update( delta );
        }
    }
};