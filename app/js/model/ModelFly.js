    var IW = IW || {};
	/**
	 *
	 * @param {IW.Model} model
	 * @constructor
	 */
	IW.ModelFly = function ( model ) {

		/**
		 * It scale for calculate
		 *
		 * @const {number}
		 */
		var SCALE = 20;

		/**
		 *
		 * @type {{forward: boolean, left: boolean, right: boolean, backward: boolean, flyStatus: boolean, stop: boolean}}
		 */
		var motion = { forward: false, left: false, right: false, backward: false, flyStatus: false, stop: false };

		/**
		 *
		 * @type {IW.Model}
		 */
		this._model = model;

		/**
		 *
		 * @type {IW.ModelFly}
		 */
		var scope = this;

		/**
		 * Callback for keyboard
		 *
		 * @param {{}.<motion>} motion
		 * @callback callbackKeyboard
		 */

		/**
		 *
		 * @type {?callbackKeyboard}
		 * @private
		 */
		this._callback = null;

		/**
		 * Calculate incline model
		 *
		 * @returns {void}
		 */
		function calcIncline() {
			if ( scope._model.getCurrentSpeed() > scope._model.getInclineMinSpeed() ) {
				if ( motion.left ) {
					if ( scope._model.getInclineAngle() > - scope._model.getInclineMaxAngle() ) {
						scope._model.reduceInclineAngle();
						scope._model.modelIncline( 'z', scope._model.getInclineAngle() );
					}
				}

				if ( motion.right ) {
					if ( scope._model.getInclineAngle() < scope._model.getInclineMaxAngle() ) {
						scope._model.increaseInclineAngle();
						scope._model.modelIncline( 'z', scope._model.getInclineAngle() );
					}
				}
			}

			if ( ( !motion.left && !motion.right ) || motion.backward ) {
				if ( scope._model.getInclineAngle() < 0 ) {
					scope._model.addInclineAngle( + 0.03 );
					scope._model.modelIncline( 'z', scope._model.getInclineAngle() );
				}

				if ( scope._model.getInclineAngle() > 0 ) {
					scope._model.addInclineAngle( - 0.03 );
					scope._model.modelIncline( 'z', scope._model.getInclineAngle() );
				}
			}
		}

		var down = false;

		/**
		 * Set parameter motion in event "keydown"
		 *
		 * @param {KeyboardEvent} e
		 */
		function keyDown( e ) {
			var keyboard = scope._model.keyboard.fly;
			switch ( e.keyCode ) {
				case keyboard.forward.keyCode:
					motionControl( 'forward', true );
					break;
				case keyboard.left.keyCode:
					motionControl( 'left', true );
					break;
				case keyboard.right.keyCode:
					motionControl( 'right', true );
					break;
				case keyboard.backward.keyCode:
					motionControl( 'backward', true );
					break;
				case keyboard.stop.keyCode:
					motionControl( 'stop', true );
					break;
			}

			if (!down) {
				down = true;
				// scope._callback.call(this, motion);
			}
		}

		/**
		 * Set parameter motion in event "keyUp"
		 *
		 * @param {KeyboardEvent} e
		 */
		function keyUp( e ) {
			var keyboard = scope._model.keyboard.fly;
			switch ( e.keyCode ) {
				case keyboard.forward.keyCode:
					motionControl( 'forward', false );
					break;
				case keyboard.left.keyCode:
					motionControl( 'left', false );
					break;
				case keyboard.right.keyCode:
					motionControl( 'right', false );
					break;
				case keyboard.backward.keyCode:
					motionControl( 'backward', false );
					break;
				case keyboard.stop.keyCode:
					motionControl( 'stop', false );
					break;
			}

			if (down) {
				down = false;
				// scope._callback.call(this, motion);
			}
		}

		/**
		 * Fly or stop
		 *
		 * @returns {boolean}
		 */
		this.isFly = function () {
			for ( var key in motion ) {
				if ( 'flyStatus' !== key && motion.hasOwnProperty( key ) && motion[ key ] ) {
					return true;
				}
			}
			return false;
		};

		/**
		 * Get position motion to
		 *
		 * @param {number} far
		 * @param {number} angle
		 * @param {number} delta
		 * @returns {{ x: number, y: number, z: number }}
         */
		function calcPositionTo( far, angle, delta ) {
			angle = + angle.toFixed(9);
			changeAngle( delta );
			var m = scope._model.getPosition();
			return {
				x: m.x + ( far * Math.cos( angle ) ),
				y: 0,
				z: m.z + ( far * Math.sin( angle ) )
			};
		}

		/**
		 * This method are controlling motion parameters
		 *
		 * @param {string} direction - Possible values ( 'backward' | 'forward' | 'left' | 'right' | 'stop' )
		 * @param {boolean} status - it is value which need to set
		 * @returns {void}
		 */
		function motionControl( direction, status ) {
			if ( motion[ direction ] !== status ) {
				motion[ direction ] = status;
				motion.flyStatus = status ? status : scope.isFly();
				scope._callback.call( this, motion );
			}
		}

		/**
		 * Change angle before calculate position motion to
		 *
		 * @param {number} delta
		 * @return {void}
         */
		function changeAngle( delta ) {
			if ( scope._model.getCurrentSpeed() > 0 ) {
				if ( motion.left ) {
					scope._model.angle -= scope._model.getSpeedRadiusForward() * delta;
				} else if ( motion.right ) {
					scope._model.angle += scope._model.getSpeedRadiusForward() * delta;
				}
			}

			if ( scope._model.getCurrentSpeed() < 0 ) {
				if ( motion.left ) {
					scope._model.angle += scope._model.getSpeedRadiusBackward() * delta;
				} else if ( motion.right ) {
					scope._model.angle -= scope._model.getSpeedRadiusBackward() * delta;
				}
			}
		}

		/**
		 * Sets parameter of motion
		 *
		 * @param {{}} param
		 * @return {IW.ModelFly}
		 */
		this.setMotion = function ( param ) {
			for ( var property in param ) {
				if ( param.hasOwnProperty( property ) ) {
					motion[ property ] = param[ property ];
				}
			}
			return this;
		};

		/**
		 * Gets parameter of motion
		 *
		 * @return {{}.<motion>}
		 */
		this.getMotion = function () {
			return motion;
		};

		/**
		 *
		 * @param {callbackKeyboard} callback
		 * @return {IW.ModelFly}
		 */
		this.setEventKeyboard = function ( callback ) {
			this._callback = callback;
			window.addEventListener( 'keydown', keyDown, false );
			window.addEventListener( 'keyup', keyUp, false );
			return this;
		};

		var aimControls = {
			raycaster: new THREE.Raycaster(),
			mouse: new THREE.Vector2(),
			position: new THREE.Vector3(),
			callback: null,
			click: false,
			intersect: [],
			camera: null,
		};

		/**
		 *
		 * @param {Camera} camera
		 * @param {function} callback
		 * @returns {IW.ModelFly}
		 */
		this.setAim = function ( camera, callback ) {

			aimControls.camera = camera;
			aimControls.callback = callback;

			var x = 0, y = 0;

			var heartShape = new THREE.Shape();

			heartShape.moveTo( x, y );

			heartShape.bezierCurveTo( x - 5000, y + 1500, x + 5000, y + 1500, x, y );

			var geometry = new THREE.ShapeGeometry( heartShape, 3 );

			var material = new THREE.MeshBasicMaterial( {
				color: 0xffffff,
				side: THREE.DoubleSide,
				opacity     : 0.03,
				transparent : true,
			} );
			var plane = new THREE.Mesh( geometry, material );
			plane.rotation.x = Math.PI / 2;
			plane.position.y = 0;

			var model = scope._model.getModel();
			model.add( plane );
			aimControls.intersect.push( plane );

			window.addEventListener( 'mousemove', onMouseMove, false );
			document.body.addEventListener( 'click', onClick, false );

			return this;
		};
		
		function onClick() {
			if (aimControls.click && aimControls.callback) {
				aimControls.callback.call( this, aimControls.position );
			}
		}

		function onMouseMove( event ) {

			if (!aimControls.camera) {
				return;
			}

			// calculate mouse position in normalized device coordinates
			// (-1 to +1) for both components
			aimControls.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			aimControls.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		}

		function updateAim() {

			if (!aimControls.camera) {
				return;
			}

			// update the picking ray with the camera and mouse position
			aimControls.raycaster.setFromCamera( aimControls.mouse, aimControls.camera );

			// calculate objects intersecting the picking ray
			var intersects = aimControls.raycaster.intersectObjects( aimControls.intersect );

			if ( intersects.length > 0 ) {
				aimControls.click = true;
				aimControls.position.copy( intersects[0].point );
				$('canvas').css('cursor', 'url(images/textures/aim/aim.png) 16 16, crosshair');
			} else {
				aimControls.click = false;
				$('canvas').css('cursor', 'default');
			}
		}

		/**
		 * Update calculate position of model in order to move model
		 *
		 * @param {number} delta
		 */
		this.update = function ( delta ) {

			if ( !this._model.enabled ) {
				return;
			}

			updateAim();

			var _speedModel = this._model.getCurrentSpeed();

			if ( motion.flyStatus || _speedModel !== 0 ) {

				// scope._model.collision.update( scope._model.getModel(), function ( object ) {
                //
                //
				// } );

				var positionTo = calcPositionTo( scope._model.far, scope._model.angle, delta );
				this._model.setPositionTo( positionTo );

				if ( motion.forward ) {
					this._model.increaseCurrentSpeed();
				} else if ( motion.backward ) {
					this._model.reduceCurrentSpeed();
				}

				// Auto stop
				if ( motion.stop ) {
					this._model.reduceCurrentSpeedAuto();
				}

				var positionModel = this._model.getPosition();
				var a = ( positionTo.x - positionModel.x );
				var b = ( positionTo.z - positionModel.z );
				var len = ( Math.sqrt( a * a + b * b ) ) * SCALE;

				var x = a / len * ( _speedModel );
				var z = b / len * ( _speedModel );

				this._model.addPosition( { x: x * delta, y: 0, z: z * delta } );
			}

			calcIncline();
		};
	};
