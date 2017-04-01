
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
		max:  1000, // m.s It is maximum speed the model
		min: - 500	// m.s If less than zero. The model is moving back
	};

	this.acceleration = 10; // m.s
	this.deceleration = 10; // m.s

	this.previousPosition = new THREE.Vector3(0, 0, 0);

	/**
	 * It is approximate position to motion
	 *
	 * @type {any}
     */
	this.positionTo = new THREE.Vector3();

	var scope = this;

	var fly = false;

	var ox = 0;
	var oz = 0;

	this.update = function () {

		if ( orbitControl ) {

			if ( this.object ) {

				// orbitControl
				// 	.stopMoveCamera()
				// 	.moveCameraTo( this.object );
			}

			orbitControl.update();
		}
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
		orbitControl.minDistance = 30;
		orbitControl.maxPolarAngle = 75 * Math.PI / 180;
		orbitControl.maxDistance = 3000;
		orbitControl.rotateSpeed = 3.0;

		return this;
	};

	/**
	 *
	 *
	 * @returns {void}
     */
	function motionControl() {

		if ( motion.left && motion.right ) {

			motion.left = false;
			motion.right = false;

		}

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

	window.addEventListener( 'keydown', keyDown, false );
	window.addEventListener( 'keyup', keyUp, false );
};
