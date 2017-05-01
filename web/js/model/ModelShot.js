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
     *
     * @type {{}}
     */
    this.weaponConfig = this.model.multiLoader.getFile(IW.ModelShot.CONFIG_WEAPON);

    /**
     * It is active shots
     *
     * @type {Array}
     */
    this.charges = [];

    /**
     *
     * @type {IW.ModelShot}
     */
    var scope = this;

    /**
     * Callback for shot
     *
     * @param {string} weaponType
     * @callback callbackShot
     */

    /**
     *
     * @type {?callbackShot}
     * @private
     */
    this._shotCallback = null;

    /**
     *
     * @param {callbackShot} callback
     */
    this.setShotCallback = function ( callback ) {
        this._shotCallback = callback;
        return this;
    };

    /**
     * This method is creating shot, setting parameters and adding in scene his.
     *
     * @param {string|number} type
     * @returns {void}
     */
    this.shot = function ( type ) {

        if ( !this.weaponConfig.hasOwnProperty( 'weapon' ) ) {
            console.warn( 'Config is not correct' );
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
     *
     * @param {{ radius: number, model: (string|number), speed: number, intervalTime: number, charges: number }} config
     * @param {number} [timeout] - default 0
     * @param {number} [start] - default 0
     */
    function setShotTimeout( config, timeout, start ) {

        start = start == undefined ? 0 : start;

        setTimeout( function () {

            var p = scope.model.getPosition();
            var x = p.x + config.radius * Math.cos( scope.model.angle );
            var z = p.z + config.radius * Math.sin( scope.model.angle );

            var mesh = scope.model.multiLoader.getObject( config.model );
            mesh.speed = config.speed;
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
     * Callback for collision
     *
     * @callback callbackCollision
     */

    /**
     *
     * @type {?callbackCollision}
     * @private
     */
    this._collisionCallback = null;

    /**
     *
     * @param {callbackCollision} callback
     * @return {IW.ModelShot}
     */
    this.setCollisionShotCallback = function ( callback ) {
        this._collisionCallback = callback;
        return this;
    };

    /**
     *
     * @param {THREE.Mesh} mesh
     * @param {number} key - It is key element in array "this.charges"
     */
    function collisionShot( mesh, key ) {
        scope.model.collision.update( mesh, function ( object ) {

            console.log( object.name );
            //
            // if ( scope._collisionCallback ) {
            //     scope._collisionCallback.call( this, object );
            // }
            //
            // scope.charges.splice( key, 1 );
            // scope.model.scene.remove( mesh );
            // scope.model.scene.remove( object );
        } );
    }

    this.removeShot = function ( key, mesh ) {

    };

    /**
     *
     * @param {number} delta
     */
    this.update = function ( delta ) {

        if ( this.charges.length > 0 ) {

            for ( var i = 0; i < this.charges.length; i++ ) {

                var mesh = this.charges[ i ];

                var a = mesh.positionTo.x - mesh.position.x;
                var b = mesh.positionTo.z - mesh.position.z;
                var len =  Math.sqrt( a * a + b * b ) * 100;

                var speed = this.model.getCurrentSpeed() + mesh.speed + delta;
                var ox = a / len * speed;
                var oz = b / len * speed;

                mesh.position.x += ox;
                mesh.position.z += oz;
                mesh.lookAt( mesh.positionTo );

                collisionShot( mesh, i );

                if ( mesh && mesh.position.distanceTo( mesh.positionTo ) < Math.sqrt( ox * ox + oz * oz ) ) {

                    console.log( '---' );

                    this.charges.splice( i, 1 );
                    scope.model.scene.remove( mesh );
                }
            }
        }
    };
};

IW.ModelShot.CONFIG_WEAPON = 'config-weapon';

IW.ModelShot.MODEL_R1_A = 'R1_A';
IW.ModelShot.MODEL_R1_B = 'R1_B';
IW.ModelShot.MODEL_R1_C = 'R1_C';