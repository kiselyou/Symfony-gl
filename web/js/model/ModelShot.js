var IW = IW || {};
/**
 *
 * @param {IW.MultiLoader} multiLoader
 * @param {IW.Model} model
 * @param {Scene} scene
 * @constructor
 */
IW.ModelShot = function ( multiLoader, model, scene ) {

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    /**
     *
     * @type {Scene}
     */
    this.scene = scene;

    /**
     *
     * @type {{}}
     */
    this.weaponConfig = multiLoader.getFile(IW.ModelShot.CONFIG_WEAPON);

    var intersectExceptUUID = [];
    var elementsCollision = scene.children.filter( function ( value ) {

        return value instanceof THREE.Mesh;

    } );

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

            var mesh = multiLoader.getObject( config.model );
            mesh.speed = config.speed;
            mesh.position.copy( p );
            mesh.positionTo = new THREE.Vector3( x, 0, z );

            scope.charges.push( mesh );
            scope.scene.add( mesh );

            start++;

            if ( start <= config.charges ) {
                setShotTimeout( config, config.intervalTime, start );
            }

        }, timeout );
    }

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

                // var originPoint = mesh.position.clone();
                //
                // for (var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++) {
                //
                //     var localVertex = mesh.geometry.vertices[vertexIndex].clone();
                //     var globalVertex = localVertex.applyMatrix4( mesh.matrix );
                //     var directionVector = globalVertex.sub( mesh.position );
                //
                //     var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
                //     var collisionResults = ray.intersectObjects( elementsCollision );
                //
                //     if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                //         // console.log(collisionResults[0][ 'object' ]);
                //         //
                //         this.charges.splice( i, 1 );
                //         scope.scene.remove( mesh );
                //         scope.scene.remove( collisionResults[0][ 'object' ] );
                //         break;
                //     }
                // }

                if ( mesh && mesh.position.distanceTo( mesh.positionTo ) < Math.sqrt( ox * ox + oz * oz ) ) {

                    this.charges.splice( i, 1 );
                    scope.scene.remove( mesh );
                }
            }
        }
    };
};

IW.ModelShot.CONFIG_WEAPON = 'config-weapon';

IW.ModelShot.MODEL_R1_A = 'R1_A';
IW.ModelShot.MODEL_R1_B = 'R1_B';
IW.ModelShot.MODEL_R1_C = 'R1_C';