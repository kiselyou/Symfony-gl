    var IW = IW || {};
	/**
	 *
	 * @param {IW.Model} model
	 * @param {IW.ShotControls} shot
	 * @param {PerspectiveCamera} camera
	 * @constructor
	 */
	IW.FlyControls = function ( model, shot, camera ) {

		/**
		 *
		 * @type {IW.Model}
		 */
		this._model = model;

		/**
		 *
		 * @type {PerspectiveCamera}
		 */
		this.camera = camera;

		/**
		 * It is approximate position to motion
		 *
		 * @type {number}
		 */
		this.far = 1000;

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
        lbl.append( IW.LabelControls.TPL_SPEED, this._model.getCurrentSpeed(), this._model.getPosition(), IW.LabelControls.POSITION_RT );

		/**
		 *
		 * @param {number} delta
         */
		this.update = function ( delta ) {

			var _positionModel = this._model.getPosition();
			var _speedModel = this._model.getCurrentSpeed();

			updatePositionAim();

            lbl.updateLabel( IW.LabelControls.TPL_SPEED, 'Speed: ' + _speedModel );
            lbl.updatePosition( IW.LabelControls.TPL_SPEED, _positionModel, IW.LabelControls.POSITION_RT );
            lbl.updatePosition( IW.LabelControls.TPL_AIM, _positionAim, IW.LabelControls.POSITION_C );

			if ( fly || _speedModel != 0 ) {

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

				var a = positionTo.x - _positionModel.x;
				var b = positionTo.z - _positionModel.z;
				var len = Math.sqrt( a * a + b * b ) * IW.FlyControls.SCALE;

				var x = a / len * ( _speedModel + delta );
				var z = b / len * ( _speedModel + delta );

				this._model.addPosition( x, 0, z );
			}

			incline();
			shot.setSpeedModel( _speedModel );
			shot.update( delta );

            if ( _panel ) {
                _panel.updateProgress( 1, this._model.getCurrentEnergy() );
                _panel.updateProgress( 4, _speedModel );
            }
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

            _panel.addProgress( 1, 'energy', this._model.getMaxEnergy(), this._model.getReductionEnergy(), '#FF9900' );
            _panel.addProgress( 2, 'armor', 4000, 20, '#008AFA' );
            _panel.addProgress( 3, 'hull', 1000, 10, '#C10020' );
            _panel.addProgress( 4, 'speed', this._model.getMaxSpeed(), 0, '#FFFFFF' );

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
		var motion = { forward: false, left: false, right: false, backward: false };

		/**
		 *
		 * @param {KeyboardEvent} e
		 */
		function keyDown( e ) {

			var _fly = scope._model.keyboard.fly;

			switch ( e.keyCode ) {
				case _fly.forward.keyCode:
					motion.forward = true;
					break;
				case _fly.left.keyCode:
					motion.left = true;
					break;
				case _fly.right.keyCode:
					motion.right = true;
					break;
				case _fly.backward.keyCode:
					motion.backward = true;
					break;
			}

			motionControl();
			fly = true;
		}

		/**
		 *
		 * @param {KeyboardEvent} e
		 */
		function keyUp( e ) {

			var _fly = scope._model.keyboard.fly;

			switch ( e.keyCode ) {
				case _fly.forward.keyCode:
					motion.forward = false;
					break;
				case _fly.left.keyCode:
					motion.left = false;
					break;
				case _fly.right.keyCode:
					motion.right = false;
					break;
				case _fly.backward.keyCode:
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
		 * Incline ship
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
		 * Get position Aim
		 *
		 * @returns {Vector3}
		 */
		function updatePositionAim() {

			var m = scope._model.getPosition();
			var x = m.x + scope.far * Math.cos( scope._model.angle );
			var z = m.z + scope.far * Math.sin( scope._model.angle );

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

			if ( scope._model.getCurrentSpeed() > 0 ) {

				if ( motion.left ) {
					scope._model.angle -= scope._model.getSpeedRadiusForward();
				}

				if ( motion.right ) {
					scope._model.angle += scope._model.getSpeedRadiusForward();
				}
			}

			if ( scope._model.getCurrentSpeed() < 0 ) {

				if (motion.left) {
					scope._model.angle += scope._model.getSpeedRadiusBackward();
				}

				if (motion.right) {
					scope._model.angle -= scope._model.getSpeedRadiusBackward();
				}
			}

			var m = scope._model.getPosition();
			var x = m.x + scope.far * Math.cos( scope._model.angle );
			var z = m.z + scope.far * Math.sin( scope._model.angle );

			_positionTo.setX( x );
			_positionTo.setZ( z );

			return _positionTo;
		}

		window.addEventListener( 'keydown', keyDown, false );
		window.addEventListener( 'keyup', keyUp, false );
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
