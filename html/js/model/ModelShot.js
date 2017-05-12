var IW = IW || {};
/**
 *
 * @param {IW.Model} model
 * @constructor
 */
IW.ModelShot = function ( model ) {

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    /**
     * It is configuration weapon of current user
     *
     * @type {{}}
     */
    this.weaponConfig = this.model.multiLoader.getFile( IW.Prepare.CONFIG_KEY_WEAPON );

    /**
     * It is active shots
     *
     * @type {Array}
     */
    this.charges = [];

    /**
     * It is callback function. Will be call when user shot
     *
     * @param {string} weaponType - It is type weapon. Need for get configuration about it
     * @callback callbackShot
     */

    /**
     * It is callback function. Will be call when user shot
     *
     * @type {?callbackShot}
     * @private
     */
    this._shotCallback = null;

	/**
	 * It is callback function. Will be call when collide of shot
	 *
	 * @callback callbackCollision
	 */

	/**
     * It is callback function. Will be call when collide of shot
	 *
	 * @type {?callbackCollision}
	 * @private
	 */
	this._collisionCallback = null;

	/**
	 *
	 * @type {IW.ModelShot}
	 */
	var scope = this;

    /**
     *
     * @param {{ radius: number, model: (string|number), speed: number, intervalTime: number, charges: number, damage: {} }} config
     * @param {number} [timeout] - default 0
     * @param {number} [start] - default 0
     */
    function setShotTimeout( config, timeout, start ) {

        start = start === undefined ? 0 : start;

        setTimeout( function () {
            if (!scope.model.getPosition()) {
                return;
            }
            var p = scope.model.getPosition();
            var x = p.x + config.radius * Math.cos( scope.model.angle );
            var z = p.z + config.radius * Math.sin( scope.model.angle );

            var mesh = scope.model.multiLoader.getObject( config.model );

            mesh.damage = config.damage;
            mesh.speed = config.speed + scope.model.getCurrentSpeed();

            mesh.position.copy( p );
            mesh.positionTo = new THREE.Vector3( x, 0, z );
            mesh.lookAt( mesh.positionTo );

            scope.charges.push( mesh );
            scope.model.scene.add( mesh );

            start++;

            if ( start < config.charges ) {
                setShotTimeout( config, config.intervalTime, start );
            }

        }, timeout );
    }

	/**
	 *
	 * @param {number} key - It is key element in array "this.charges"
	 * @param {THREE.Mesh} mesh
	 * @requires {void}
	 */
	function collisionShot( key, mesh ) {
		scope.model.collision.update( mesh, function ( object ) {
			scope.model.findClientModel( object.name, function ( client ) {

				scope.destroyShot( key );
				client.setDamage( mesh.damage );

				var paramToClient = {
					weaponKey: key,
					clientName: object.name,
					param: client.paramsToJSON( ['armor', 'hull'] ),
					destroy: client.isDestroyed()
				};

				if ( scope._collisionCallback ) {
					scope._collisionCallback.call( this, paramToClient );
				}

				if ( client.isDestroyed() ) {
					scope.model.destroyModel( true, object.name );
				}
			} );
		} );
	}

    /**
     * It is callback function. Will be call when collide of shot
     *
     * @param {callbackCollision} callback
     * @return {IW.ModelShot}
     */
    this.setCollisionShotCallback = function ( callback ) {
        this._collisionCallback = callback;
        return this;
    };

	/**
     * Destroy shot from scene are using effect
     *
	 * @param {string|number} key
     * @returns {IW.ModelShot}
	 */
	this.destroyShot = function ( key ) {
	    var mesh = this.charges[ key ];
        this.model.explosion.addEvent( 1, mesh.position );
        this.model.scene.remove( mesh );
        this.charges.splice( key, 1 );
        return this;
    };

	/**
	 * Destroy all shots from scene are using effect
	 *
	 * @returns {IW.ModelShot}
	 */
    this.destroyShots = function () {
        for ( var i = 0; i < this.charges.length; i++ ) {
            this.destroyShot( 0 );
        }
	    return this;
    };

	/**
	 * It is callback function. Will be call when user shot
	 *
	 * @param {callbackShot} callback
	 */
	this.setShotCallback = function ( callback ) {
		this._shotCallback = callback;
		return this;
	};

	/**
	 * This method is creating shot, setting parameters and adding it to scene
	 *
	 * @param {string|number} type
	 * @returns {void}
	 */
	this.shot = function ( type ) {

		if ( !this.weaponConfig || !this.weaponConfig.hasOwnProperty( 'weapon' ) ) {
			console.warn( 'Config "weapon" is not correct' );
			return;
		}

		if ( !this.weaponConfig.weapon.hasOwnProperty( type ) ) {
			console.warn( 'Can not find weapon "' + type + '"' );
			return;
		}

		if ( this._shotCallback ) {
			this._shotCallback.call( this, type );
		}

		var config = this.weaponConfig.weapon[ type ];

		if ( ( this.model.getCurrentEnergy() >= config.energy ) && config.active ) {
			config.active = false;
			this.model.addEnergy( - config.energy );

			setShotTimeout( config, 0 );

			setTimeout( function () {
				config.active = true;
			}, config.reloadingTime );
		}
	};

	/**
     * Update position of shot
	 *
	 * @param {number} delta
	 */
	this.update = function ( delta ) {
		if ( this.charges.length > 0 && this.model.enabled ) {
			for ( var i = 0; i < this.charges.length; i++ ) {

				var mesh = this.charges[ i ];
				var a = mesh.positionTo.x - mesh.position.x;
				var b = mesh.positionTo.z - mesh.position.z;
				var len =  Math.sqrt( a * a + b * b ) * 100;

				var speed = mesh.speed + delta;
				var ox = a / len * speed;
				var oz = b / len * speed;

				mesh.position.x += ox;
				mesh.position.z += oz;
				mesh.lookAt( mesh.positionTo );

				collisionShot( i, mesh );

				if ( mesh && mesh.position.distanceTo( mesh.positionTo ) < Math.sqrt( ox * ox + oz * oz ) ) {
					scope.destroyShot( i );
				}
			}
		}
	};
};