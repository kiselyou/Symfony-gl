
THREE.ShotControls = function ( scene ) {

    this._scene = scene;

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



    var geometry = new THREE.SphereGeometry( 1, 5, 5, 0, Math.PI * 2, 0, Math.PI * 2 );
    var material = new THREE.MeshLambertMaterial( { color: '#FFFF00' } );
    var charge1 = new THREE.Mesh( geometry, material );

    var weapon = {
        slot_1: {
            active: true,
            radius: 1500,
            speed: 0.1,
            startSpeed: 0,
            interval: 10,
            charges: 5,
            positionTo: new THREE.Vector3()
        },
        slot_2: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        },
        slot_3: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        },
        slot_4: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        },
        slot_5: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        },
        slot_6: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        },
        slot_7: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        },
        slot_8: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        },
        slot_9: {
            active: false,
            radius: 50,
            speed: 0.001,
            startSpeed: 0,
            interval: 10,
            charges: 10,
            positionTo: new THREE.Vector3()
        }
    };

    var freeShots = [];

    /**
     * @param {string} type
     * @param {Vector3} position
     * @param {number} angle
     */
    function shot( type, position, angle ) {

        if ( weapon.hasOwnProperty( type ) && weapon[ type ][ 'active' ]) {

            var radius = weapon[ type ][ 'radius' ];
            var charges = weapon[ type ][ 'charges' ];
            var interval = weapon[ type ][ 'interval' ];

            if ( charges > 0 ) {

                var startCharge = 0;
                var idInterval = setInterval(function() {

                    weapon[ type ][ 'positionTo' ].setX( position.x + radius * Math.cos( angle ) );
                    weapon[ type ][ 'positionTo' ].setZ( position.z + radius * Math.sin( angle ) );

                    var mesh = charge1.clone();
                    mesh.position.copy( position );
                    mesh[ 'param' ] = weapon[ type ];

                    freeShots.push( mesh );
                    scope._scene.add( mesh );

                    startCharge++;

                    if ( startCharge == charges ) {

                        clearInterval( idInterval );
                    }

                }, interval);
            }
        }
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

        switch ( event.keyCode ) {
            case scope.keys.WEAPON_SLOT_1:
                // turnOnWeapon( 1 );
                var angle = getAngle( scope.previousPosition, scope.object.position );
                shot( 'slot_1', scope.object.position, angle );

                break;
            case scope.keys.WEAPON_SLOT_2:
                turnOnWeapon( 2 );
                break;
            case scope.keys.WEAPON_SLOT_3:
                turnOnWeapon( 3 );
                break;
            case scope.keys.WEAPON_SLOT_4:
                turnOnWeapon( 4 );
                break;
            case scope.keys.WEAPON_SLOT_5:
                turnOnWeapon( 5 );
                break;
            case scope.keys.WEAPON_SLOT_6:
                turnOnWeapon( 6 );
                break;
            case scope.keys.WEAPON_SLOT_7:
                turnOnWeapon( 7 );
                break;
            case scope.keys.WEAPON_SLOT_8:
                turnOnWeapon( 8 );
                break;
            case scope.keys.WEAPON_SLOT_9:
                turnOnWeapon( 9 );
                break;
        }

        // console.log(weapon);
    };

    this.update = function () {

        if ( freeShots.length > 0 ) {

            for ( var i = 0; i < freeShots.length; i++ ) {

                var mesh = freeShots[ i ];
                var param = mesh[ 'param' ];

                param.startSpeed += param.speed;
                mesh.position.lerp( param.positionTo, param.startSpeed );

                if ( param.startSpeed >= 1 ) {
                    param.startSpeed = 0;
                    freeShots.splice( i, 1 );
                    scope._scene.remove( mesh );
                }
            }
        }
    };
};