    var IW = IW || {};
	/**
	 *
	 * @param {Scene} scene
	 * @param {IW.MultiLoader} multiLoader
	 * @param {PerspectiveCamera} camera
	 * @param {Element} domElement
	 * @constructor
	 */
	IW.FlyControls = function ( scene, multiLoader, camera, domElement ) {

		/**
		 *
		 * @type {Mesh}
		 */
		this.object = multiLoader.getObject(IW.SceneControls.MODEL_S1_A);

		/**
		 *
		 * @type {Scene}
		 */
		this.scene = scene;
		this.scene.add( this.object );

		/**
		 *
		 * @type {IW.ShotControls}
		 */
		var shot = new IW.ShotControls( this.object, multiLoader, this.scene );

		/**
		 *
		 * @type {PerspectiveCamera}
		 */
		this.camera = camera;

		/**
		 *
		 * @type {Element}
		 */
		this.domElement = domElement;

		/**
		 * It is approximate position to motion
		 *
		 * @type {number}
		 */
		this.far = 1000;

		/**
		 *
		 * @type {number}
		 */
		this.speedRadiusForward = 0.01;

		/**
		 *
		 * @type {number}
		 */
		this.speedRadiusBackward = 0.005;

		/**
		 *
		 * @type {{current: number, max: number, min: number}}
		 */
		this.speed = {
			current: 0, // m.s Can not be less than zero. Default 0
			max:  1650, // m.s It is maximum speed the model
			min: -150	// m.s If less than zero. The model is moving back
		};

		/**
		 *
		 * @type {number}
		 */
		this.acceleration = 5;  // m.s

		/**
		 *
		 * @type {number}
		 */
		this.deceleration = 10;  // m.s

		/**
		 *
		 * @type {{angle: number, speed: number, max: number, inclineMinSpeed: number}}
		 */
		this.rotate = {
			angle: 0,
			speed: 0.09, // Скорость наклона - процент от скорости объекта (radian)
			max: THREE.Math.degToRad( 35 ), // Максимальный угол наклона ( radian )
			inclineMinSpeed: 150 // Наклоны при скорости от "inclineMinSpeed"
		};

		/**
		 *
		 * @type {IW.FlyControls}
		 */
		var scope = this;

		/**
		 *
		 * @type {boolean}
		 */
		var fly = false;

		/**
		 *
		 * @type {IW.LabelControls}
		 */
		var lbl = new IW.LabelControls( scope.camera );
        lbl.append( IW.LabelControls.TPL_AIM, '' );
        lbl.append( IW.LabelControls.TPL_SPEED, this.speed.current, this.object.position, IW.LabelControls.POSITION_RT );

		this.update = function ( delta ) {
			updatePositionAim();
            lbl.updateLabel( IW.LabelControls.TPL_SPEED, 'Speed: ' + this.speed.current );
            lbl.updatePosition( IW.LabelControls.TPL_SPEED, this.object.position, IW.LabelControls.POSITION_RT );
            lbl.updatePosition( IW.LabelControls.TPL_AIM, _positionAim, IW.LabelControls.POSITION_C );

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
				var len = Math.sqrt( a * a + b * b ) * IW.FlyControls.SCALE;

				this.object.position.x += a / len * ( this.speed.current + delta );
				this.object.position.z += b / len * ( this.speed.current + delta );
			}

			incline();
			shot.setSpeedModel( scope.speed.current );
			shot.update( delta );

			orbitControl.stopMoveCamera();
			orbitControl.target.copy( scope.object.position );
			orbitControl.update();

            if ( _panel ) {
                _panel.updateProgress( 1, shot.energy.current );
                _panel.updateProgress( 4, scope.speed.current );
            }
		};

		/**
		 * Add object to model
		 *
		 * @param {Mesh} object
		 * @returns {IW.FlyControls}
         */
		this.addToModel = function (object) {
			this.object.add(object);
			return this;
		};

		/**
		 *
		 * @returns {Vector3}
         */
		this.getModelPosition = function () {
			return this.object.position;
		};

		/**
		 *
		 * @type {THREE.OrbitControls|null}
		 */
		var orbitControl = null;

		/**
		 *
		 * @returns {IW.FlyControls}
		 */
		this.initOrbitControl = function () {

			orbitControl = new THREE.OrbitControls( scope.camera, scope.domElement );
			orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
			orbitControl.enablePan = false;
			orbitControl.enableKeys = false;
            orbitControl.rotateSpeed = 2.0;
			orbitControl.minDistance = 20;
			orbitControl.maxDistance = 450;
            orbitControl.maxPolarAngle = 75 * Math.PI / 180;
            orbitControl.minPolarAngle = 45 * Math.PI / 180;
			return this;
		};

        /**
         *
         * @type {null|IW.PanelControl}
         * @private
         */
        var _panel = null;

        /**
         * @returns {void}
         */
        this.initPanel = function () {

            var miniMap = new IW.MiniMap();
            miniMap.appendTo();

            _panel = new IW.PanelControl( miniMap );

            var actions = IW.FlyControls.ACTIONS;

            for (var i = 0; i < actions.length; i++) {
                setActionShot( actions[ i ], actions[ i ][ 'action' ] );
            }

            _panel.addProgress( 1, 'energy', shot.energy.max, shot.energy.reduction, '#FF9900' );
            _panel.addProgress( 2, 'armor', 4000, 20, '#008AFA' );
            _panel.addProgress( 3, 'hull', 1000, 10, '#C10020' );
            _panel.addProgress( 4, 'speed', scope.speed.max, 0, '#FFFFFF' );

            _panel.addCallback( 1, function ( param ) {
                shot.addEnergy( param.reduction );
            });

            _panel.appendTo();
        };

        /**
         * Set action
         *
         * @param {{ name: [(?string|number)], icon: [(?string|number)], keyCode: [?number], active: [boolean], type: string|number }} param
         * @param {number|string} type
         */
        function setActionShot( param, type ) {

            switch ( type ) {
                // Add actions - Shot
                case IW.FlyControls.ACTION_SHOT:
                    _panel.addAction( function () {

                        shot.shot( param.type );

                    }, param.name, param.icon, param.keyCode, param.active );
                    break;
                // Add action - Full Screen
                case IW.FlyControls.ACTION_FULL_SCREEN:
                    _panel.addAction( function () {

                        new IW.FullScreen().toggle();

                    }, param.name, param.icon, param.keyCode, param.active );
                    break;
            }
        }

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

		/**
		 *
		 * @type {{forward: boolean, left: boolean, right: boolean, backward: boolean}}
		 */
		var motion = {
			forward: false,
			left: false,
			right: false,
			backward: false
		};

		/**
		 *
		 * @type {{forward: {keyName: string, keyCode: number}, left: {keyName: string, keyCode: number}, right: {keyName: string, keyCode: number}, backward: {keyName: string, keyCode: number}}}
		 */
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

		/**
		 *
		 * @param {KeyboardEvent} e
		 */
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

		var pl = plane();
		function plane() {
			var planeGeometry = new THREE.PlaneGeometry(10000, 10000);
			var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
			var plane = new THREE.Mesh(planeGeometry, planeMaterial);

			plane.rotation.x = -0.5 * Math.PI;
			plane.receiveShadow = true;
			scope.scene.add(plane);
			return plane;
		}

		var raycaster = new THREE.Raycaster();

		function mouseMove(e) {

			var mouse = new THREE.Vector2();
			mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = -( e.clientY / window.innerHeight ) * 2 + 1;


			raycaster.setFromCamera(mouse, scope.camera);
			var intersects = raycaster.intersectObject(pl);
			if (intersects.length > 0) {

				var _angle = getAngle( scope.object.position, intersects[0]['point'] ) / Math.PI * 180;
				var _mAngle = scope.object.params.angel / Math.PI * 180;

				motion.left = (_mAngle > _angle);
				motion.right = (_mAngle < _angle);

			} else {

				motion.left = false;
				motion.right = false;
			}
		}

		/**
		 *
		 * @param {KeyboardEvent} e
		 */
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

		/**
		 * Fly or stop
		 *
		 * @returns {boolean}
		 */
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
		scope.object.params = {
			angel: getAngle( _prev, scope.object.position )
		};

			/**
		 * Incline ship
		 *
		 * @returns {void}
		 */
		function incline() {

			var speed = THREE.Math.degToRad( scope.speed.current * scope.rotate.speed / 100 );

			var rotation = scope.object.children[0].rotation;

			if ( scope.speed.current > scope.rotate.inclineMinSpeed ) {

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
		function updatePositionAim() {

			var x = scope.object.position.x + scope.far * Math.cos( scope.object.params.angel );
			var z = scope.object.position.z + scope.far * Math.sin( scope.object.params.angel );

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
					scope.object.params.angel -= scope.speedRadiusForward;
				}

				if ( motion.right ) {
					scope.object.params.angel += scope.speedRadiusForward;
				}
			}

			if ( scope.speed.current < 0 ) {

				if (motion.left) {
					scope.object.params.angel += scope.speedRadiusBackward / 3;
				}

				if (motion.right) {
					scope.object.params.angel -= scope.speedRadiusBackward / 3;
				}
			}

			var x = scope.object.position.x + scope.far * Math.cos( scope.object.params.angel );
			var z = scope.object.position.z + scope.far * Math.sin( scope.object.params.angel );

			_positionTo.setX( x );
			_positionTo.setZ( z );

			return _positionTo;
		}

		window.addEventListener( 'keydown', keyDown, false );
		window.addEventListener( 'keyup', keyUp, false );
		this.domElement.addEventListener( 'mousemove', mouseMove, false );
	};

	/**
	 *
	 * @const {number}
	 */
	IW.FlyControls.SCALE = 100;
    IW.FlyControls.ACTION_SHOT = 'shot';
    IW.FlyControls.ACTION_FULL_SCREEN = 'full_screen';

    IW.FlyControls.ACTIONS = [];

    IW.FlyControls.ACTIONS.push(
        {
            name: null,
            icon: 'fullscreen',
            keyCode: null,
            active: true,
            type: null,
            action: IW.FlyControls.ACTION_FULL_SCREEN
        }
    );

    IW.FlyControls.ACTIONS.push(
        {
            name: '1',
            icon: 'move',
            keyCode: 49,
            active: false,
            type: IW.ShotControls.GUN_1,
            action: IW.FlyControls.ACTION_SHOT
        },
		{
			name: '2',
			icon: 'move',
			keyCode: 50,
			active: false,
			type: IW.ShotControls.GUN_2,
			action: IW.FlyControls.ACTION_SHOT
		},
		{
			name: '3',
			icon: 'move',
			keyCode: 51,
			active: false,
			type: IW.ShotControls.GUN_3,
			action: IW.FlyControls.ACTION_SHOT
		},
		{
			name: '4',
			icon: 'move',
			keyCode: 52,
			active: false,
			type: IW.ShotControls.GUN_4,
			action: IW.FlyControls.ACTION_SHOT
		},
		{
			name: '5',
			icon: 'move',
			keyCode: 53,
			active: false,
			type: IW.ShotControls.GUN_5,
			action: IW.FlyControls.ACTION_SHOT
		},
		{
			name: '6',
			icon: 'move',
			keyCode: 54,
			active: false,
			type: IW.ShotControls.GUN_6,
			action: IW.FlyControls.ACTION_SHOT
		},
		{
			name: '7',
			icon: 'move',
			keyCode: 55,
			active: false,
			type: IW.ShotControls.GUN_7,
			action: IW.FlyControls.ACTION_SHOT
		},
		{
			name: '8',
			icon: 'move',
			keyCode: 56,
			active: false,
			type: IW.ShotControls.GUN_8,
			action: IW.FlyControls.ACTION_SHOT
		},
		{
			name: '9',
			icon: 'move',
			keyCode: 57,
			active: false,
			type: IW.ShotControls.GUN_9,
			action: IW.FlyControls.ACTION_SHOT
		}
    );
