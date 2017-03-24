
THREE.ShotControls = function ( scene ) {

    this._scene = scene;

    var intersectExceptUUID = [];
    var elementsCollision = scene.children.filter( function ( value ) {

        return value instanceof THREE.Mesh;
    } );

    console.log(elementsCollision);

    /**
     *
     * @type {{WATCH_FOR_MODEL: number, CHOOSE: number}}
     */
    this.keys = {
        CHOOSE: 17,
        WATCH_FOR_MODEL: 32,
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

    var scope = this;



    var geometry = new THREE.SphereGeometry( 0.3, 5, 5, 0, Math.PI * 2, 0, Math.PI * 2 );
    var material = new THREE.MeshLambertMaterial( { color: '#EAEAEA' } );
    var charge1 = new THREE.Mesh( geometry, material );

    /**
     * Текущее количество энергии
     *
     * @type {number}
     */
    this.energy = 10000;

    /**
     *
     * @type {number}
     */
    this.speedModel = 2000;

    var GUN_1 = 1;
    var GUN_2 = 2;
    var GUN_3 = 3;
    var GUN_4 = 4;
    var GUN_5 = 5;
    var GUN_6 = 6;
    var GUN_7 = 7;
    var GUN_8 = 8;
    var GUN_9 = 9;

    var weapon = {
        1: {
            active: true, // актывный слот
            radius: 2500, // максимальное растояние выстрела
            speed: 2000, // скорость залпа
            intervalTime: 10, // интервал каждого залпа
            charges: 10, // количество залпов
            energy: 100, // объем энергии на один выстрел 10 залпов
            reloadingTime: 300 // Время перезарадки после каждого выстрела
        },
        2: {
            active: true,
            radius: 5000,
            speed: 5000,
            intervalTime: 5,
            charges: 15,
            energy: 200,
            reloadingTime: 600
        },
        3: {
            active: true,
            radius: 5000,
            speed: 10000,
            intervalTime: 5,
            charges: 10,
            energy: 300,
            reloadingTime: 800
        },
        4: {
            active: true,
            radius: 5000,
            speed: 20000,
            intervalTime: 10,
            charges: 5,
            energy: 200,
            reloadingTime: 300
        },
        5: {
            active: true,
            radius: 50,
            speed: 0.001,
            intervalTime: 10,
            charges: 10,
            energy: 100,
            reloadingTime: 100
        },
        6: {
            active: true,
            radius: 50,
            speed: 0.001,
            intervalTime: 10,
            charges: 10,
            energy: 100,
            reloadingTime: 100
        },
        7: {
            active: true,
            radius: 50,
            speed: 0.001,
            intervalTime: 10,
            charges: 10,
            energy: 100,
            reloadingTime: 100
        },
        8: {
            active: true,
            radius: 50,
            speed: 0.001,
            intervalTime: 10,
            charges: 10,
            energy: 100,
            reloadingTime: 100
        },
        9: {
            active: true,
            radius: 50,
            speed: 0.001,
            intervalTime: 10,
            charges: 10,
            energy: 100,
            reloadingTime: 100
        }
    };

    var freeShots = [];

    /**
     * @param {string|number} type
     * @param {Vector3} position
     * @param {number} angle
     * @returns {void}
     */
    function shot( type, position, angle ) {

        if ( !weapon.hasOwnProperty( type ) ) {

            console.warn( 'Can not find slot "' + type + '"' );
            return;
        }

        var slot = weapon[ type ];

        var energy = slot[ 'energy' ];

        if ( ( scope.energy >= energy ) &&slot[ 'active' ] ) {

           slot[ 'active' ] = false;

            scope.energy -=  energy;

            var radius =slot[ 'radius' ];
            var charges =slot[ 'charges' ];

            var startCharge = 0;
            var idInterval = setInterval(function() {

                var x = position.x + radius * Math.cos( angle );
                var z = position.z + radius * Math.sin( angle );

                var mesh = getChargedObject( type );
                mesh.position.copy( position );
                mesh.positionTo = new THREE.Vector3( x, 0, z );
                mesh.speed =slot[ 'speed' ];

                freeShots.push( mesh );
                scope._scene.add( mesh );

                startCharge++;

                if ( startCharge == charges ) {

                    clearInterval( idInterval );
                }

            },slot[ 'intervalTime' ]);

            setTimeout(function () {

               slot[ 'active' ] = true;

            },slot[ 'reloadingTime' ]);
        }
    }

    /**
     * Получить модель снаряда
     *
     * @param {string|number} type
     * @returns {Mesh|{}}
     */
    function getChargedObject( type ) {

        var mesh = {};

        switch (type) {
            case GUN_1:
                mesh = charge1.clone();
                break;
            case GUN_2:
                mesh = charge1.clone();
                break;
            case GUN_3:
                mesh = charge1.clone();
                break;
            case GUN_4:
                mesh = charge1.clone();
                break;
            case GUN_5:
                mesh = charge1.clone();
                break;
            case GUN_6:
                mesh = charge1.clone();
                break;
            case GUN_7:
                mesh = charge1.clone();
                break;
            case GUN_8:
                mesh = charge1.clone();
                break;
            case GUN_9:
                mesh = charge1.clone();
                break;
            default:
                mesh = charge1.clone();
                break
        }

        mesh[ 'positionTo' ] = new THREE.Vector3();

        return mesh;
    }

    /**
     *
     * @param {Vector3} a
     * @param {Vector3} b
     * @param {boolean} [degree] If true return value in degree else radians
     * @returns {number}
     */
    function getAngle ( a, b, degree ) {

        var v = new THREE.Vector3();
        v.subVectors( b, a );
        var radians = Math.atan2(v.z, v.x);

        return degree ? ( radians * 180 / Math.PI ) : radians;
    }

    /**
     *
     * @param {number} num - possible values '1-9'
     * @returns {void}
     */
    function turnOnWeapon( num ) {

        var property = 'slot_' + num;

        if ( !weapon.hasOwnProperty( property ) ) {
            console.warn( 'You have to set value from 1 to 9' );
            return;
        }

        switch ( weapon[ property ][ 'active' ] ) {
            case true:
                weapon[ property ][ 'active' ] = false;
                break;
            case false:
                weapon[ property ][ 'active' ] = true;
                break;
        }
    }

    this.object = null;

    this.setModel = function ( model ) {
        this.object = model;
    };

    this.setPreviousPositionModel = function ( v ) {
        this.previousPosition = v;
        return this;
    };

    /**
     *
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    this.onKeyDown = function ( event ) {

        var angle = getAngle( scope.previousPosition, scope.object.position );

        switch ( event.keyCode ) {
            case scope.keys.WEAPON_SLOT_1:
                shot( GUN_1, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_2:
                shot( GUN_2, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_3:
                shot( GUN_3, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_4:
                shot( GUN_4, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_5:
                shot( GUN_5, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_6:
                shot( GUN_6, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_7:
                shot( GUN_7, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_8:
                shot( GUN_8, scope.object.position, angle );
                break;
            case scope.keys.WEAPON_SLOT_9:
                shot( GUN_9, scope.object.position, angle );
                break;
        }

        // console.log(weapon);
    };

    this.update = function () {

        if ( freeShots.length > 0 ) {

            for ( var i = 0; i < freeShots.length; i++ ) {

                var mesh = freeShots[ i ];

                var a = mesh.positionTo.x - mesh.position.x;
                var b = mesh.positionTo.z - mesh.position.z;
                var len =  Math.sqrt( a * a + b * b ) * 1000;

                var speed = scope.speedModel + mesh.speed;
                var ox = a / len * speed;
                var oz = b / len * speed;

                mesh.position.x += ox;
                mesh.position.z += oz;




                var originPoint = mesh.position.clone();

                for (var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++) {
                    var localVertex = mesh.geometry.vertices[vertexIndex].clone();
                    var globalVertex = localVertex.applyMatrix4( mesh.matrix );
                    var directionVector = globalVertex.sub( mesh.position );

                    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
                    var collisionResults = ray.intersectObjects( elementsCollision );

                    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                        console.log(collisionResults[0][ 'object' ]);

                        freeShots.splice( i, 1 );
                        scope._scene.remove( mesh );
                        scope._scene.remove( collisionResults[0][ 'object' ] );
                    }
                }






                if ( mesh.position.distanceTo( mesh.positionTo ) <= 10 ) {
                    freeShots.splice( i, 1 );
                    scope._scene.remove( mesh );
                }
            }
        }
    };
};