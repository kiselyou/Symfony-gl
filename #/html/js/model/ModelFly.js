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
		var SCALE = 100;

		/**
		 * It is approximate position to motion
		 *
		 * @type {Vector3}
		 */
		var _positionTo = new THREE.Vector3();

		/**
		 *
		 * @type {{forward: boolean, left: boolean, right: boolean, backward: boolean, flyStatus: boolean}}
		 */
		var motion = { forward: false, left: false, right: false, backward: false, flyStatus: false };

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
		function calculateIncline() {
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
					scope._model.addInclineAngle( + 0.01 );
					scope._model.modelIncline( 'z', scope._model.getInclineAngle() );
				}

				if ( scope._model.getInclineAngle() > 0 ) {
					scope._model.addInclineAngle( - 0.01 );
					scope._model.modelIncline( 'z', scope._model.getInclineAngle() );
				}
			}
		}

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
			}
		}

		/**
		 * Fly or stop
		 *
		 * @returns {boolean}
		 */
		function isFly() {
			for ( var key in motion ) {
				if ( 'flyStatus' !== key && motion.hasOwnProperty( key ) && motion[ key ] ) {
					return true;
				}
			}
			return false;
		}

		/**
		 * Get position motion to
		 *
		 * @returns {Vector3}
		 */
		function getPositionTo( far, angle ) {
			changeAngle();
			var m = scope._model.getPosition();
			var x = m.x + far * Math.cos( angle );
			var z = m.z + far * Math.sin( angle );
			_positionTo.setX( x );
			_positionTo.setZ( z );
			return _positionTo;
		}

		/**
		 * This method are controlling motion parameters
		 *
		 * @param {string} direction - Possible values ( 'backward' | 'forward' | 'left' | 'right' )
		 * @param {boolean} status - it is value which need to set
		 */
		function motionControl( direction, status ) {
			if ( motion[ direction ] !== status ) {
				motion[ direction ] = status;
				motion.flyStatus = status ? status : isFly();
			}
		}

		/**
		 * Change angle before calculate position motion to
		 *
		 * @return {void}
         */
		function changeAngle() {
			if ( scope._model.getCurrentSpeed() > 0 ) {
				if ( motion.left ) {
					scope._model.angle -= scope._model.getSpeedRadiusForward();
				} else if ( motion.right ) {
					scope._model.angle += scope._model.getSpeedRadiusForward();
				}
			}

			if ( scope._model.getCurrentSpeed() < 0 ) {
				if ( motion.left ) {
					scope._model.angle += scope._model.getSpeedRadiusBackward();
				} else if ( motion.right ) {
					scope._model.angle -= scope._model.getSpeedRadiusBackward();
				}
			}
		}

		/**
		 * Sets parameter of motion
		 *
		 * @param {{}.<motion>} param
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
			callToClient();
			return this;
		};

		function callToClient() {

			if ( scope._callback ) {

				var fps = 6;
				var statusCallToClient = true;

				setTimeout(function tick() {

					if ( motion.flyStatus || statusCallToClient ) {
						scope._callback.call(this, motion);
					}

					setTimeout(tick, 1000 / fps);
					statusCallToClient = motion.flyStatus;

				}, 1000 / fps);
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

			var _speedModel = this._model.getCurrentSpeed();

			if ( motion.flyStatus || _speedModel !== 0 ) {

				// scope._model.collision.update( scope._model.getModel(), function ( object ) {
                //
                //
				// } );

				var positionTo = getPositionTo( scope._model.far, scope._model.angle );
				this._model.setPositionTo( positionTo );

				if ( motion.forward ) {
					this._model.increaseCurrentSpeed();
				} else if ( motion.backward ) {
					this._model.reduceCurrentSpeed();
				}

				// Auto stop
				if ( !motion.forward && !motion.backward && !motion.left && !motion.right ) {
					this._model.reduceCurrentSpeedAuto();
				}

				var _positionModel = this._model.getPosition();
				var a = positionTo.x - _positionModel.x;
				var b = positionTo.z - _positionModel.z;
				var len = Math.sqrt( a * a + b * b ) * SCALE;

				var x = a / len * ( _speedModel + delta );
				var z = b / len * ( _speedModel + delta );

				this._model.addPosition( { x: x, y: 0, z: z } );
			}

			calculateIncline();
		};
	};