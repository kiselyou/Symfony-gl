    /**
     *
     * @param {THREE.MultiLoader} multiLoader
     * @param {Scene} scene
     * @constructor
     */
    THREE.ShotControls = function ( multiLoader, scene ) {

        /**
         *
         * @type {Scene}
         */
        this.scene = scene;

        var intersectExceptUUID = [];
        var elementsCollision = scene.children.filter( function ( value ) {

            return value instanceof THREE.Mesh;

        } );

        /**
         *
         * @type {{WEAPON_SLOT_1: number, WEAPON_SLOT_2: number, WEAPON_SLOT_3: number, WEAPON_SLOT_4: number, WEAPON_SLOT_5: number, WEAPON_SLOT_6: number, WEAPON_SLOT_7: number, WEAPON_SLOT_8: number, WEAPON_SLOT_9: number}}
         */
        this.keys = {
            WEAPON_SLOT_1: 49,
            WEAPON_SLOT_2: 50,
            WEAPON_SLOT_3: 51,
            WEAPON_SLOT_4: 52,
            WEAPON_SLOT_5: 53,
            WEAPON_SLOT_6: 54,
            WEAPON_SLOT_7: 55,
            WEAPON_SLOT_8: 56,
            WEAPON_SLOT_9: 57
        };

        /**
         * Текущее количество энергии
         *
         * @type {{current: number, max: number, min: number}}
         */
        this.energy = {
            current: 1000,
            max: 1000,
            min: 10,
            reduction: 5
        };

        /**
         *
         * @param {number} int
         * @returns {THREE.ShotControls}
         */
        this.addEnergy = function ( int ) {
            if ( scope.energy.current + int > scope.energy.max ) {
                scope.energy.current = scope.energy.max;
            } else {
                scope.energy.current += int;
            }

            return scope;
        };

        /**
         *
         * @type {number}
         */
        this.speedModel = 0;

        /**
         *
         * @param {number} speed
         * @returns {THREE.ShotControls}
         */
        this.setSpeedModel = function ( speed ) {
            this.speedModel = speed < 0 ? 0 : speed;
            return this;
        };

        /**
         *
         * @type {THREE.ShotControls}
         */
        var scope = this;

        /**
         * It is active shots
         *
         * @type {Array}
         */
        var freeShots = [];

        /**
         * This method is creating shot, setting parameters and adding in scene his.
         *
         * @param {string|number} type
         * @param {Vector3} position
         * @param {number} angle
         * @returns {void}
         */
        this.shot = function ( type, position, angle ) {

            if ( !THREE.ShotControls.WEAPON.hasOwnProperty( type ) ) {

                console.warn( 'Can not find slot "' + type + '"' );
                return;
            }

            var slot = THREE.ShotControls.WEAPON[ type ];

            if ( ( scope.energy.current >= slot.energy ) && slot.active ) {

                slot.active = false;
                scope.energy.current -=  slot.energy;

                var startCharge = 0;
                var idInterval = setInterval( function() {

                    var x = position.x + slot.radius * Math.cos( angle );
                    var z = position.z + slot.radius * Math.sin( angle );

                    var mesh = multiLoader.getModel( slot.model );
                    mesh.speed = slot.speed;
                    mesh.position.copy( position );
                    mesh.positionTo = new THREE.Vector3( x, 0, z );

                    freeShots.push( mesh );
                    scope.scene.add( mesh );

                    startCharge++;

                    if ( startCharge == slot.charges ) {

                        clearInterval( idInterval );
                    }

                }, slot.intervalTime );

                setTimeout( function () {

                   slot.active = true;

                }, slot.reloadingTime );
            }
        };

        /**
         *
         * @param {KeyboardEvent} event
         * @param {Vector3} startPosition
         * @param {number} angle
         * @returns {void}
         */
        this.onKeyDown = function( event, startPosition, angle ) {

            switch ( event.keyCode ) {
                case scope.keys.WEAPON_SLOT_1:
                    scope.shot( THREE.ShotControls.GUN_1, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_2:
                    scope.shot( THREE.ShotControls.GUN_2, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_3:
                    scope.shot( THREE.ShotControls.GUN_3, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_4:
                    scope.shot( THREE.ShotControls.GUN_4, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_5:
                    scope.shot( THREE.ShotControls.GUN_5, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_6:
                    scope.shot( THREE.ShotControls.GUN_6, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_7:
                    scope.shot( THREE.ShotControls.GUN_7, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_8:
                    scope.shot( THREE.ShotControls.GUN_8, startPosition, angle );
                    break;
                case scope.keys.WEAPON_SLOT_9:
                    scope.shot( THREE.ShotControls.GUN_9, startPosition, angle );
                    break;
            }
        };

        /**
         *
         * @param {number} delta
         */
        this.update = function ( delta ) {

            if ( freeShots.length > 0 ) {

                for ( var i = 0; i < freeShots.length; i++ ) {

                    var mesh = freeShots[ i ];

                    var a = mesh.positionTo.x - mesh.position.x;
                    var b = mesh.positionTo.z - mesh.position.z;
                    var len =  Math.sqrt( a * a + b * b ) * 100;

                    var speed = scope.speedModel + mesh.speed + delta;
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
                    //         freeShots.splice( i, 1 );
                    //         scope.scene.remove( mesh );
                    //         scope.scene.remove( collisionResults[0][ 'object' ] );
                    //         break;
                    //     }
                    // }

                    if ( mesh && mesh.position.distanceTo( mesh.positionTo ) < Math.sqrt( ox * ox + oz * oz ) ) {

                        freeShots.splice( i, 1 );
                        scope.scene.remove( mesh );
                    }
                }
            }
        };
    };

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_1 = 1;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_2 = 2;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_3 = 3;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_4 = 4;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_5 = 5;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_6 = 6;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_7 = 7;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_8 = 8;

    /**
     * It is type shot
     *
     * @const {number}
     */
    THREE.ShotControls.GUN_9 = 9;

    /**
     *
     * @type {{}}
     */
    THREE.ShotControls.WEAPON = {};

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_1 ] = {
        model: 'mi-rocket',
        active: true, // актывный слот или заблокированный
        radius: 15000, // максимальное растояние выстрела
        speed: 5000, // скорость залпа
        intervalTime: 50, // интервал каждого залпа
        charges: 1, // количество залпов
        energy: 100, // объем энергии на один выстрел 10 залпов
        reloadingTime: 300 // Время перезарадки после каждого выстрела
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_2 ] = {
        model: '',
        active: true,
        radius: 5000,
        speed: 5000,
        intervalTime: 5,
        charges: 5,
        energy: 200,
        reloadingTime: 500
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_3 ] = {
        model: '',
        active: true,
        radius: 5000,
        speed: 10000,
        intervalTime: 5,
        charges: 4,
        energy: 300,
        reloadingTime: 400
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_4 ] = {
        model: '',
        active: true,
        radius: 5000,
        speed: 20000,
        intervalTime: 10,
        charges: 1,
        energy: 200,
        reloadingTime: 300
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_5 ] = {
        model: '',
        active: true,
        radius: 50,
        speed: 0.001,
        intervalTime: 10,
        charges: 10,
        energy: 100,
        reloadingTime: 100
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_6 ] = {
        model: '',
        active: true,
        radius: 50,
        speed: 0.001,
        intervalTime: 10,
        charges: 10,
        energy: 100,
        reloadingTime: 100
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_7 ] = {
        model: '',
        active: true,
        radius: 50,
        speed: 0.001,
        intervalTime: 10,
        charges: 10,
        energy: 100,
        reloadingTime: 100
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_8 ] = {
        model: '',
        active: true,
        radius: 50,
        speed: 0.001,
        intervalTime: 10,
        charges: 10,
        energy: 100,
        reloadingTime: 100
    };

    /**
     *
     * @type {{model: string, active: boolean, radius: number, speed: number, intervalTime: number, charges: number, energy: number, reloadingTime: number}}
     */
    THREE.ShotControls.WEAPON[ THREE.ShotControls.GUN_9 ] = {
        model: '',
        active: true,
        radius: 50,
        speed: 0.001,
        intervalTime: 10,
        charges: 10,
        energy: 100,
        reloadingTime: 100
    };