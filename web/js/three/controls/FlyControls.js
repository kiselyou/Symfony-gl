
THREE.FlyControls = function ( object, camera, domElement ) {

	var SCALE = 100;

	this.object = object;

	this.camera = camera;

	this.domElement = domElement;

	/**
	 * It is approximate position to motion
	 *
	 * @type {number}
     */
	this.far = 1000;
	this.radius = 50;

	this.speed = {
		current: 0, // m.s Can not be less than zero. Default 0
		max:  1500, // m.s It is maximum speed the model
		min: - 500	// m.s If less than zero. The model is moving back
	};

	this.acceleration = 20; // m.s
	this.deceleration = 10;  // m.s

	var scope = this;

	var fly = false;

	var ox = 0;
	var oz = 0;

	this.update = function () {

	    if ( fly || scope.speed.current != 0 ) {

			var positionTo = getPositionTo();

            scope.object.lookAt( positionTo );

	    	if ( motion.direct && scope.speed.current < scope.speed.max ) {

				scope.speed.current += scope.acceleration;
			}

			if ( motion.direct && scope.speed.current > scope.speed.max ) {

				scope.speed.current = scope.speed.max;
			}

			if ( motion.backward && scope.speed.current > scope.speed.min ) {

				scope.speed.current -= scope.deceleration;
			}

			if ( motion.backward && scope.speed.current < scope.speed.min ) {

				scope.speed.current = scope.speed.min;
			}

			// Авто торможение
			if ( !motion.direct && !motion.backward ) {

				if ( scope.speed.current > scope.deceleration ) {

					scope.speed.current -= scope.deceleration;

				} else if ( scope.speed.current < - scope.deceleration ) {

					scope.speed.current += scope.deceleration;

				} else {

					scope.speed.current = 0;
				}
			}

            var a = positionTo.x - this.object.position.x;
            var b = positionTo.z - this.object.position.z;
            var len = Math.sqrt( a * a + b * b ) * SCALE;

            ox = a / len * this.speed.current;
            oz = b / len * this.speed.current;

			this.object.position.x += ox;
			this.object.position.z += oz;

        }

            // if (orbitControl) {
            //
            //     if (this.object) {
            //
            //         orbitControl
            //             .stopMoveCamera()
            //             .moveCameraTo(this.object);
            //     }
            //
            //     orbitControl.update();
            // }
	};

	/**
	 *
	 * @type {THREE.OrbitControls|null}
     */
	var orbitControl = null;

	/**
	 *
	 * @returns {THREE.FlyControls}
     */
	this.initOrbitControl = function () {

        // orbitControl = new THREE.OrbitControls( scope.camera, scope.domElement );
        // orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
        // orbitControl.enablePan = false;
        // orbitControl.enableKeys = false;
        // orbitControl.minDistance = 30;
        // orbitControl.maxPolarAngle = 75 * Math.PI / 180;
        // orbitControl.maxDistance = 1000;
        // orbitControl.rotateSpeed = 3.0;
        // orbitControl.enabled = false;

		return this;
	};

	/**
	 *
	 *
	 * @returns {void}
     */
	function motionControl() {

		if ( motion.direct && motion.backward ) {

			motion.direct = false;
			motion.backward = false;

		}
	}

	var motion = {
		direct: false,
		left: false,
		right: false,
		backward: false
	};

	var keyboard = {
		direct: {
			keyName: 'W',
			keyCode: 87
		},
		left: {
			keyName: 'A',
			keyCode: 65
		},
		right: {
			keyName: 'D',
			keyCode: 68
		},
		backward: {
			keyName: 'S',
			keyCode: 83
		}
	};

	function keyDown( e ) {

		switch ( e.keyCode ) {
			case keyboard.direct.keyCode:
				motion.direct = true;
				break;
			case keyboard.left.keyCode:
				motion.left = true;
				break;
			case keyboard.right.keyCode:
				motion.right = true;
				break;
			case keyboard.backward.keyCode:
				motion.backward = true;
				break;
		}

		motionControl();
		fly = true;
	}

	function keyUp( e ) {

		switch ( e.keyCode ) {
			case keyboard.direct.keyCode:
				motion.direct = false;
				break;
			case keyboard.left.keyCode:
				motion.left = false;
				break;
			case keyboard.right.keyCode:
				motion.right = false;
				break;
			case keyboard.backward.keyCode:
				motion.backward = false;
				break;
		}

		motionControl();
		fly = isFly();
	}

	function isFly() {

		for ( var key in motion ) {

			if ( motion.hasOwnProperty( key ) && motion[ key ] ) {

				return true;
			}
		}

		return false;
	}

	/**
	 *
	 * @param {Vector3} a
	 * @param {Vector3} b
	 * @returns {number}
	 */
	function getAngle( a, b ) {

        var v = new THREE.Vector3();
		v.subVectors( b, a );
		return Math.atan2( v.z, v.x );
	}

	/**
	 * It is approximate position to motion
	 *
	 * @type {Vector3}
	 */
	var _positionTo = new THREE.Vector3();

	/**
	 *
	 * @type {Vector3}
	 * @private
     */
	var _prev = new THREE.Vector3( 0, 0, -1000 );

    /**
     *
     * @type {number}
     * @private
     */
    var _angle = getAngle( _prev, scope.object.position );

	/**
	 *
     */
	function getPositionTo() {

	    if ( motion.direct && scope.speed.current > 0 ) {

            if (motion.left) {
                _angle -= 0.01;
            }

            if (motion.right) {
                _angle += 0.01;
            }
        }

        if ( motion.backward && scope.speed.current < 0 ) {

            if (motion.left) {
                _angle += 0.005;
            }

            if (motion.right) {
                _angle -= 0.005;
            }
        }

		var x = scope.object.position.x + scope.far * Math.cos( _angle );
		var z = scope.object.position.z + scope.far * Math.sin( _angle );

		_positionTo.setX( x );
		_positionTo.setZ( z );

		return _positionTo;
	}

	window.addEventListener( 'keydown', keyDown, false );
	window.addEventListener( 'keyup', keyUp, false );
};
