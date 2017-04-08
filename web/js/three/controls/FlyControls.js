
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
	this.far = 10000;
	this.speedRadiusForward = 0.01;
	this.speedRadiusBackward = 0.005;

	this.speed = {
		current: 0, // m.s Can not be less than zero. Default 0
		max:  6500, // m.s It is maximum speed the model
		min: -500	// m.s If less than zero. The model is moving back
	};

	this.acceleration = 20;  // m.s
	this.deceleration = 50;  // m.s

	this.rotate = {
		angle: 0,
		speed: 0.015, // Скорость наклона - процент от скорости объекта (radian)
		max: THREE.Math.degToRad( 35 ) // Максимальный угол наклона ( radian )
	};

	var scope = this;

	var fly = false;

	var ox = 0;
	var oz = 0;

	var aim = new THREE.LabelControls( scope.camera );
	aim.append( 'aim', '' );
	aim.append( 'distance', 0, this.object.position, 'left|top' );
	aim.append( 'speed', this.speed.current, this.object.position, 'right|top' );

	this.update = function ( delta ) {

		aim.updatePosition( 'aim', getPositionAim(), 'center' );
		aim.updateLabel( 'speed', 'Speed: ' + this.speed.current );
		aim.updatePosition( 'speed', this.object.position, 'right|top' );

		aim.updateLabel( 'distance', 'Distance: ' + this.speed.current );
		aim.updatePosition( 'distance', this.object.position, 'left|top' );

	    if ( fly || scope.speed.current != 0 ) {

			var positionTo = getPositionTo();
            scope.object.lookAt( positionTo );

	    	if ( motion.forward && scope.speed.current < scope.speed.max ) {

				scope.speed.current += scope.acceleration;
			}

			if ( motion.forward && scope.speed.current > scope.speed.max ) {

				scope.speed.current = scope.speed.max;
			}

			if ( motion.backward && scope.speed.current > scope.speed.min ) {

				scope.speed.current -= scope.speed.current < 0 ? scope.deceleration / 10 : scope.deceleration;
			}

			if ( motion.backward && scope.speed.current < scope.speed.min ) {

				scope.speed.current = scope.speed.min;
			}

			// Авто торможение
			if ( !motion.forward && !motion.backward && !motion.left && !motion.right ) {

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

            ox = a / len * ( this.speed.current + delta );
            oz = b / len * ( this.speed.current + delta );

			this.object.position.x += ox;
			this.object.position.z += oz;
        }

		incline();

		orbitControl.stopMoveCamera();
		orbitControl.target.copy( scope.object.position );
		orbitControl.update();

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

        orbitControl = new THREE.OrbitControls( scope.camera, scope.domElement );
        orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
        orbitControl.enablePan = false;
        orbitControl.enableKeys = false;
        orbitControl.minDistance = 600;
        orbitControl.maxPolarAngle = 75 * Math.PI / 180;
		orbitControl.minPolarAngle = 45 * Math.PI / 180;
        orbitControl.maxDistance = 2500;
        orbitControl.rotateSpeed = 3.0;

        // orbitControl.enabled = false;

		return this;
	};

	/**
	 *
	 *
	 * @returns {void}
     */
	function motionControl() {

		if ( motion.forward && motion.backward ) {

			motion.forward = false;
			motion.backward = false;

		}
	}

	var motion = {
		forward: false,
		left: false,
		right: false,
		backward: false
	};

	var keyboard = {
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
	};

	function keyDown( e ) {

		switch ( e.keyCode ) {
			case keyboard.forward.keyCode:
				motion.forward = true;
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
			case keyboard.forward.keyCode:
				motion.forward = false;
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
	 * It is approximate position aim
	 *
	 * @type {Vector3}
	 */
	var _positionAim = new THREE.Vector3();

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
	 * Incline ship
	 *
	 * @returns {void}
     */
	function incline() {

		var speed = THREE.Math.degToRad( scope.speed.current * scope.rotate.speed / 100 );

		var rotation = scope.object.children[0].rotation;

		if ( scope.speed.current > 500 ) {

			if ( motion.left ) {

				if ( scope.rotate.angle > - scope.rotate.max ) {

					scope.rotate.angle -= scope.rotate.angle < 0 ? speed : speed * 1.2;
					rotation.z = scope.rotate.angle;

				}
			}

			if ( motion.right ) {

				if ( scope.rotate.angle < scope.rotate.max ) {

					scope.rotate.angle += scope.rotate.angle > 0 ? speed : speed * 1.2;
					rotation.z = scope.rotate.angle;
				}
			}
		}

		if ( ( !motion.left && !motion.right ) || motion.backward ) {

			if ( scope.rotate.angle < 0 ) {

				scope.rotate.angle += 0.01;
				rotation.z = scope.rotate.angle;
			}

			if ( scope.rotate.angle > 0 ) {

				scope.rotate.angle -= 0.01;
				rotation.z = scope.rotate.angle;
			}
		}
	}

	/**
	 * Get position Aim
	 *
	 * @returns {Vector3}
     */
	function getPositionAim() {

		var x = scope.object.position.x + scope.far * Math.cos( _angle );
		var z = scope.object.position.z + scope.far * Math.sin( _angle );

		_positionAim.setX( x );
		_positionAim.setZ( z );

		return _positionAim;
	}

	/**
	 * Get position motion to
	 *
	 * @returns {Vector3}
     */
	function getPositionTo() {

	    if ( scope.speed.current > 0 ) {

            if ( motion.left ) {
                _angle -= scope.speedRadiusForward;
            }

            if ( motion.right ) {
                _angle += scope.speedRadiusForward;
            }
        }

        if ( scope.speed.current < 0 ) {

            if (motion.left) {
                _angle += scope.speedRadiusBackward / 3;
            }

            if (motion.right) {
                _angle -= scope.speedRadiusBackward / 3;
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
