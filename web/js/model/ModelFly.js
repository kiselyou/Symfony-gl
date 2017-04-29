    var IW = IW || {};
	/**
	 *
	 * @param {IW.Model} model
	 * @constructor
	 */
	IW.ModelFly = function ( model ) {

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
		 *
		 * @param {number} delta
         */
		this.update = function ( delta ) {

			var _speedModel = this._model.getCurrentSpeed();

			if ( motion.fly || _speedModel != 0 ) {

				var positionTo = getPositionTo();
				this._model.setPositionTo( positionTo );

				if ( motion.forward ) {
					this._model.increaseCurrentSpeed();
				} else if ( motion.backward ) {
					this._model.reduceCurrentSpeed();
				}

				// Авто торможение
				if ( !motion.forward && !motion.backward && !motion.left && !motion.right ) {
					this._model.autoReduceCurrentSpeed();
				}

				var _positionModel = this._model.getPosition();
				var a = positionTo.x - _positionModel.x;
				var b = positionTo.z - _positionModel.z;
				var len = Math.sqrt( a * a + b * b ) * IW.ModelFly.SCALE;

				var x = a / len * ( _speedModel + delta );
				var z = b / len * ( _speedModel + delta );

				this._model.addPosition( x, 0, z );

				if ( scope._callback ) {
					scope._callback.call(this, motion);
				}
			}

			incline();
		};

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

		/**
		 * Incline model
		 *
		 * @returns {void}
		 */
		function incline() {

			if ( scope._model.getCurrentSpeed() > scope._model.getInclineMinSpeed() ) {
				if ( motion.left ) {
					if ( scope._model.getInclineAngle() > - scope._model.getInclineMaxAngle() ) {
						scope._model.reduceInclineAngle();
						scope._model.modelInclineZ( scope._model.getInclineAngle() );
					}
				}

				if ( motion.right ) {
					if ( scope._model.getInclineAngle() < scope._model.getInclineMaxAngle() ) {
						scope._model.increaseInclineAngle();
						scope._model.modelInclineZ( scope._model.getInclineAngle() );
					}
				}
			}

			if ( ( !motion.left && !motion.right ) || motion.backward ) {
				if ( scope._model.getInclineAngle() < 0 ) {
					scope._model.addInclineAngle( + 0.01 );
					scope._model.modelInclineZ( scope._model.getInclineAngle() );
				}

				if ( scope._model.getInclineAngle() > 0 ) {
					scope._model.addInclineAngle( - 0.01 );
					scope._model.modelInclineZ( scope._model.getInclineAngle() );
				}
			}
		}

		/**
		 *
		 * @param {string} direction
         * @param {boolean} status
         */
		function motionControl( direction, status ) {
			if ( motion[direction] !== status ) {
				motion[direction] = status;
				motion.fly = status ? status : isFly();
			}
		}

		/**
		 *
		 * @type {{ forward: boolean, left: boolean, right: boolean, backward: boolean, fly: boolean }}
		 */
		var motion = { forward: false, left: false, right: false, backward: false, fly: false };

        /**
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
				if ( 'fly' !== key && motion.hasOwnProperty( key ) && motion[ key ] ) {
					return true;
				}
			}
			return false;
		}

		/**
		 * It is approximate position to motion
		 *
		 * @type {Vector3}
		 */
		var _positionTo = new THREE.Vector3();

		/**
		 * Get position motion to
		 *
		 * @returns {Vector3}
		 */
		function getPositionTo() {
			changeAngle();
			var m = scope._model.getPosition();
			var x = m.x + scope._model.far * Math.cos( scope._model.angle );
			var z = m.z + scope._model.far * Math.sin( scope._model.angle );

			_positionTo.setX( x );
			_positionTo.setZ( z );

			return _positionTo;
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
	};

	/**
	 *
	 * @const {number}
	 */
	IW.ModelFly.SCALE = 100;