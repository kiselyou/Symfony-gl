
THREE.FlyControls = function ( object, camera, domElement ) {

	this.object = object;

	this.camera = camera;

	this.domElement = domElement;

	this.far = 1000;

	this.speed = 500;

	this.previousPosition = new THREE.Vector3(0, 0, -1);
	this.positionTo = new THREE.Vector3();

	var scope = this;

	var move = false;

	this.update = function () {

		if ( move ) {

			var a = this.positionTo.x - this.object.position.x;
			var b = this.positionTo.z - this.object.position.z;
			var len = Math.sqrt(a * a + b * b) * 1000;

			var ox = a / len * this.speed;
			var oz = b / len * this.speed;

			this.object.position.x += ox;
			this.object.position.z += oz;
		}

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
	 * @returns {void}
     */
	function moveDirect() {
		var angle = getAngle( scope.previousPosition, scope.object.position );
		setPositionTo( scope.far, angle );
	}

	/**
	 *
	 * @param {Vector3} a
	 * @param {Vector3} b
	 * @returns {number}
	 */
	function getAngle ( a, b ) {

		var v = new THREE.Vector3();
		v.subVectors( b, a );
		return Math.atan2(v.z, v.x);
	}

	/**
	 *
	 * @param {number} far
	 * @param {number} angle
	 * @returns {void}
     */
	function setPositionTo( far, angle ) {

		scope.positionTo.setX( scope.object.position.x + far * Math.cos( angle ) );
		scope.positionTo.setZ( scope.object.position.z + far * Math.sin( angle ) );
	}

	function keyDown( e ) {

		switch ( e.keyCode ) {
			case 87:
				moveDirect();
				move = true;
				break;

		}
	}

	function keyUp( e ) {

		switch ( e.keyCode ) {
			case 87:
				move = false;
				break;

		}
	}

	window.addEventListener( 'keydown', keyDown, false );
	window.addEventListener( 'keyup', keyUp, false );
};
