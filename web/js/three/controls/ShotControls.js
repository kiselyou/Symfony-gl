
THREE.ShotControls = function () {

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

    function charge( color ) {

        color = color == undefined ? '#FFFF00' : color;

        var geometry = new THREE.SphereGeometry( 0.3, 5, 5, 0, Math.PI * 2, 0, Math.PI * 2 );
        var material = new THREE.MeshLambertMaterial( { color: color } );
        return new THREE.Mesh( geometry, material );
    }

    var weapon = {
        slot_1: {
            active: false,
            radius: 1500,
            speed: 5000,
            interval: 10,
            shots: [
                charge(),
                charge(),
                charge(),
                charge(),
                charge()
            ]
        },
        slot_2: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        },
        slot_3: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        },
        slot_4: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        },
        slot_5: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        },
        slot_6: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        },
        slot_7: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        },
        slot_8: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        },
        slot_9: {
            active: false,
            radius: 50,
            speed: 5000,
            shots: [

            ]
        }
    };

    /**
     *
     *@param {Mesh} model
     * @param {number} angle
     */
    function shot( model, angle ) {

        // var angle = params.angleStart + ( Math.PI / 2 );
        //
        // switch ( params.direction ) {
        //     case LEFT:
        //         angle = params.angleStart - ( Math.PI / 2 );
        //         break;
        // }

        for ( var slot in weapon ) {

            if ( weapon.hasOwnProperty( slot ) && weapon[ slot ][ 'active' ]) {

                var radius = weapon[ slot ][ 'radius' ];

                var x = model.position.x + radius * Math.cos( angle );
                var z = model.position.z + radius * Math.sin( angle );
                var positionTo = new THREE.Vector3( x, 0, z );


                weapon[ slot ][ 'active' ] = false;
            }
        }
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
                turnOnWeapon( 1 );
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

    };
};