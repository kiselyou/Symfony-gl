    var IW = IW || {};
    /**
     *
     * @param {IW.MultiLoader} multiLoader
     * @param {string} idElement
     * @param {boolean} [lock]
     * @constructor
     */
    IW.SceneControls = function ( multiLoader, idElement, lock ) {
        /**
         *
         * @type {IW.MultiLoader}
         */
        this.multiLoader = multiLoader;

        this.mapSize = {
            width: 20000,
            height: 20000,
            depth: 20000
        };

        /**
         *
         * @type {boolean}
         * @private
         */
        this._lock = lock;

        /**
         *
         * @type {THREE.Scene}
         */
        this.scene = new THREE.Scene();

        /**
         *
         * @type {Element}
         */
        this.container = document.getElementById( idElement );

        /**
         *
         * @type {WebGLRenderer}
         */
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.autoClear = false;

        /**
         *
         * @type {PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera();

        /**
         *
         * @type {THREE.Clock}
         */
        this.clock = new THREE.Clock();

        /**
         *
         * @type {IW.SceneControls}
         */
        var scope = this;

        /**
         *
         * @returns {Number}
         */
        this.getWidth = function() {
            return window.innerWidth;
        };

        /**
         *
         * @returns {Number}
         */
        this.getHeight = function() {
            return window.innerHeight;
        };

        /**
         *
         * @returns {number}
         */
        this.getAspect = function() {
            return  this.getWidth() / this.getHeight();
        };

        /**
         *
         * @type {?Mesh}
         * @private
         */
        var _skyBox = null;

        /**
         *
         * @param {Array} names
         * @returns {IW.SceneControls}
         */
        this.skyBox = function ( names ) {

            var materials = [];

            for ( var i = 0; i < names.length; i++ ) {

                var texture = this.multiLoader.getTexture( names[ i ] );
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

                var material = new THREE.MeshBasicMaterial();
                material.map = texture;
                material.side = THREE.BackSide;
                materials.push( material );
            }

            var geometry = new THREE.BoxGeometry( this.mapSize.width, this.mapSize.height, this.mapSize.depth, 1, 1, 1 );
            _skyBox = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
            this.scene.add( _skyBox );

            return this;
        };

        /**
         *
         * @type {?IW.Model}
         */
        this.model = null;

        /**
         *
         * @type {IW.Explosion}
         */
        this.explosion = null;

        /**
         *
         * @type {?IW.PanelControls}
         */
        this.panelControl = null;

        /**
         *
         * @type {?IW.LabelControls}
         */
        this.labelControl = null;

        /**
         *
         * @type {THREE.OrbitControls}
         */
        this.orbitControl = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        /**
         *
         * @type {?IW.Socket}
         */
        var socket = null;

        /**
         *
         * @returns {void}
         */
        this.play = function () {

            socket = new IW.Socket();

			socket.connect(
			    function ( response, resourceId ) {

			        console.log(resourceId);

                    scope.explosion = new IW.Explosion( scope.multiLoader, scope.scene );
                    scope.model = new IW.Model( scope.multiLoader, scope.scene, resourceId );
                    scope.model.setExplosion( scope.explosion );
                    scope.model.load( true );


                    // Set events of fly and send info about position of user model
                    scope.model.addFlyEvents( function ( moution ) {

                        socket.sendToAll(
                            'update-model-fly',
                            {
                                modelFly: moution,
                                modelParam: scope.model.paramsToJSON( ['position', 'positionTo', 'incline', 'angle'] ),
                                resourceId: socket.getResourceId()
                            },
                            true
                        );
                    } );

                    // Send to all information about shot of user model
                    scope.model.modelShot.setShotCallback( function ( weaponType ) {
                        socket.sendToAll(
                            'update-model-shot',
                            {
                                weaponType: weaponType,
                                resourceId: socket.getResourceId()
                            },
                            true
                        );
                    } );

                    // Send info about shot collision
                    scope.model.modelShot.setCollisionShotCallback( function ( paramToClient ) {
                        socket.sendToAll(
                            'update-model-shot-collision',
                            {
                                model: paramToClient,
                                resourceId: resourceId
                            },
                            true
                        );
                    } );

                    // Send to all information about model of user
                    socket.sendToAll( 'trade-to', {
                        model: scope.model.objectToJSON(),
                        resourceId: resourceId
                    }, true );

                    socket.windowCloseControls( function () {
                        socket.sendToAll( 'unsubscribe-client', { resourceId: socket.getResourceId() }, true );
                    } );


                    scope.panelControl = new IW.PanelControls( scope.model );
                    scope.panelControl.initPanelAction();
                    scope.panelControl.initPanelMap();

                    scope.labelControl = new IW.LabelControls( scope.model, scope.camera );
                    scope.labelControl.init();

			    },

                function ( response ) {

                    /**
                     *
                     * @type {?IW.Model}
                     */
                    var clientModel = null;

			        switch ( response.key ) {

			            // Get information about new client
                        case 'trade-to':

                            // Initialisation model of client to own browser
                            clientModel = new IW.Model( scope.multiLoader, scope.scene );
                            clientModel.setExplosion( scope.explosion );
                            clientModel.load( true, response.data.model );
                            scope.model.addClientModel( clientModel );

                            // Send own model to browser of new client
                            socket.sendToSpecific( 'trade-from', {
                                model: scope.model.objectToJSON()
                            }, response.data.resourceId );

                            break;

                        // Get information about old client
                        case 'trade-from':

                            // Set model of old client to own browser
                            clientModel = new IW.Model( scope.multiLoader, scope.scene );
                            clientModel.setExplosion( scope.explosion );
                            clientModel.load( true, response.data.model );
                            scope.model.addClientModel( clientModel );

                            break;

                        // Set information about event fly of client model
                        case 'update-model-fly':

                            scope.model.findClientModel(
                                response.data.resourceId,
                                function ( model ) {
                                    model.paramsJSONToObject( response.data.modelParam );
                                    model.setPositionTo( model.getPositionTo() );
                                    model.modelFly.setMotion( response.data.modelFly );

                                }
                            );

                            break;

                        // Set information about event shot of client model
                        case 'update-model-shot':

                            scope.model.findClientModel(
                                response.data.resourceId,
                                function ( model ) {
                                    model.modelShot.shot( response.data.weaponType );
                                }
                            );

                            break;

                        case 'update-model-shot-collision':

                            var clientName = response.data.model.clientName;

                            scope.model.findClientModel(
                                response.data.resourceId,
                                function ( client ) {
                                    client.modelShot.destroyShot( response.data.model.weaponKey );
                                }
                            );

                            if ( clientName === socket.getResourceId() ) {
                                scope.model.paramsJSONToObject( response.data.model.param );

                                if ( response.data.model.destroy ) {

                                    scope.model.destroyModel( true, scope.model.id );
                                    scope.labelControl.removeLabels();
                                    // Unsubscribe if client was killed
                                    socket.windowCloseControls( function () {
                                        socket.sendToAll( 'unsubscribe-client', { resourceId: socket.getResourceId() }, true );
                                    } );
                                }

                            } else {

                                scope.model.findClientModel(
                                    clientName,
                                    function ( client ) {

                                        client.paramsJSONToObject( response.data.model.param );

                                        if ( response.data.model.destroy ) {
                                            client.destroyModel( true, client.id );
                                        }
                                    }
                                );
                            }

                            break;

                        // Unsubscribe client. Remove model from scene and model controls
                        case 'unsubscribe-client':

                            scope.model.removeClientModel( true, response.data.resourceId );

                            break;
                    }

                }
            );

            socket.disconnected( function ( error ) {
                console.log( error );
            } );

            this.orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
            this.orbitControl.enablePan = false;
            this.orbitControl.enableKeys = false;
            this.orbitControl.rotateSpeed = 2.0;
            this.orbitControl.minDistance = 20;
            this.orbitControl.maxDistance = 60;
            this.orbitControl.maxPolarAngle = 75 * Math.PI / 180;
            this.orbitControl.minPolarAngle = 45 * Math.PI / 180;

            init( function ( delta ) {

                if ( scope.model ) {

                    if (scope.explosion) {
                        scope.explosion.update();
                    }
                    // if ( group && shockwaveGroup ) {
                    //     group.tick( delta );
                    //     shockwaveGroup.tick();
                    // }



                    if ( _skyBox ) {
                        _skyBox.position.copy( scope.model.getPosition() );
                    }

                    scope.orbitControl.target.copy( scope.model.getPosition() );
                    scope.orbitControl.update();

                    scope.model.update( delta );

                    if ( scope.panelControl ) {
                        scope.panelControl.update();
                    }

                    if ( scope.labelControl ) {
                        scope.labelControl.update();
                    }
                }

            } );













            // scope.clock.getDelta();
            //
            // var group = new SPE.Group( {
            //         maxParticleCount: 50000,
            //         texture: {
            //             value: scope.multiLoader.getTexture( 'explosion' ),
            //             frames: new THREE.Vector2( 5, 5 ),
            //             loop: 1
            //         },
            //         depthTest: true,
            //         depthWrite: false,
            //         blending: THREE.AdditiveBlending,
            //         scale: 600,
            //         fixedTimeStep: 0.03
            //     } ),
            //     shockwaveGroup = new SPE.Group( {
            //         maxParticleCount: 50000,
            //         texture: {
            //             value: scope.multiLoader.getTexture( 'smoke' ),
            //         },
            //         depthTest: false,
            //         depthWrite: true,
            //         blending: THREE.NormalBlending,
            //     } ),
            //     shockwave = new SPE.Emitter( {
            //         particleCount: 200,
            //         type: SPE.distributions.DISC,
            //         position: {
            //             radius: 5,
            //             spread: new THREE.Vector3( 5 )
            //         },
            //         maxAge: {
            //             value: 2,
            //             spread: 0
            //         },
            //         // duration: 1,
            //         activeMultiplier: 2000,
            //         velocity: {
            //             value: new THREE.Vector3( 40 )
            //         },
            //         rotation: {
            //             axis: new THREE.Vector3( 1, 0, 0 ),
            //             angle: Math.PI * 0.5,
            //             static: true
            //         },
            //         size: { value: 2 },
            //         color: {
            //             value: [
            //                 new THREE.Color( 0.4, 0.2, 0.1 ),
            //                 new THREE.Color( 0.2, 0.2, 0.2 )
            //             ]
            //         },
            //         opacity: { value: [0.5, 0.2, 0] }
            //     }),
            //     debris = new SPE.Emitter( {
            //         particleCount: 50,
            //         type: SPE.distributions.SPHERE,
            //         position: {
            //             radius: 0.1,
            //         },
            //         maxAge: {
            //             value: 1
            //         },
            //         // duration: 2,
            //         activeMultiplier: 40,
            //         velocity: {
            //             value: new THREE.Vector3( 100 )
            //         },
            //         acceleration: {
            //             value: new THREE.Vector3( 0, -20, 0 ),
            //             distribution: SPE.distributions.BOX
            //         },
            //         size: { value: 2 },
            //         drag: {
            //             value: 1
            //         },
            //         color: {
            //             value: [
            //                 new THREE.Color( 1, 1, 1 ),
            //                 new THREE.Color( 1, 1, 0 ),
            //                 new THREE.Color( 1, 0, 0 ),
            //                 new THREE.Color( 0.4, 0.2, 0.1 )
            //             ]
            //         },
            //         opacity: { value: [0.4, 0] }
            //     }),
            //     fireball = new SPE.Emitter( {
            //         particleCount: 10,
            //         type: SPE.distributions.SPHERE,
            //         position: {
            //             radius: 0.1
            //         },
            //         maxAge: { value: 1 },
            //         // duration: 1,
            //         activeMultiplier: 40,
            //         velocity: {
            //             value: new THREE.Vector3( 30 )
            //         },
            //         size: { value: [50, 60] },
            //         color: {
            //             value: [
            //                 new THREE.Color( 0.5, 0.1, 0.05 ),
            //                 new THREE.Color( 0.2, 0.2, 0.2 ),
            //                 new THREE.Color( 0.2, 0.1, 0.4 )
            //             ]
            //         },
            //         opacity: { value: [0.5, 0.35, 0.1, 0] }
            //     }),
            //     mist = new SPE.Emitter( {
            //         particleCount: 20,
            //         position: {
            //             spread: new THREE.Vector3( 10, 10, 10 ),
            //             distribution: SPE.distributions.SPHERE
            //         },
            //         maxAge: { value: 1 },
            //         // duration: 1,
            //         activeMultiplier: 200,
            //         velocity: {
            //             value: new THREE.Vector3( 8, 3, 10 ),
            //             distribution: SPE.distributions.SPHERE
            //         },
            //         size: { value: 50 },
            //         color: {
            //             value: new THREE.Color( 0.2, 0.2, 0.2 )
            //         },
            //         opacity: { value: [0, 0, 0.2, 0] }
            //     }),
            //     flash = new SPE.Emitter( {
            //         particleCount: 50,
            //         position: { spread: new THREE.Vector3( 5, 5, 5 ) },
            //         velocity: {
            //             spread: new THREE.Vector3( 30 ),
            //             distribution: SPE.distributions.SPHERE
            //         },
            //         size: { value: [2, 20, 20, 20] },
            //         maxAge: { value: 2 },
            //         activeMultiplier: 2000,
            //         opacity: { value: [0.5, 0.25, 0, 0] }
            //     } );
            //
            // var  emitterSettings = {
            //     type: SPE.distributions.SPHERE,
            //     position: {
            //         spread: new THREE.Vector3( 5 ),
            //         radius: 3,
            //     },
            //     velocity: {
            //         value: new THREE.Vector3( 150 )
            //     },
            //     size: {
            //         value: [ 30, 40 ]
            //     },
            //     opacity: {
            //         value: [0.5, 0]
            //     },
            //     color: {
            //         value: [new THREE.Color('yellow'),new THREE.Color('red')]
            //     },
            //     particleCount: 20,
            //     alive: true,
            //     duration: 0.05,
            //     maxAge: {
            //         value: 0.1
            //     }
            // };
            //
            // // Add a mousedown listener. When mouse is clicked, a new explosion will be created.
            // document.addEventListener( 'mousedown', createExplosion, false );
            // // Do the same for a keydown event
            // document.addEventListener( 'keydown', createExplosion, false );
            //
            // group
            //     .addPool( 10, fireball, false );
            //
            // scope.scene.add( group.mesh );
            //
            // shockwaveGroup
            //     .addPool( 10, mist, false )
            //     .addPool( 11, debris, false )
            //     ;
            //
            // scope.scene.add( shockwaveGroup.mesh );
            //
            // var pos = new THREE.Vector3( 0, 0, 50 );
            // // Trigger an explosion and random co-ords.
            // function createExplosion() {
            //     group.triggerPoolEmitter( 10, pos );
            //     // group.triggerPoolEmitter( 11, pos );
            //     //
            //     shockwaveGroup.triggerPoolEmitter( 10, pos );
            //     shockwaveGroup.triggerPoolEmitter( 11, pos );
            //
            // }






        };

        /**
         *
         * @returns {void}
         */
        this.preview = function () {

            this.model = new IW.Model( scope.multiLoader, scope.scene );
            this.model.load( true );

            this.orbitControl.autoRotateSpeed = 0.3;
            this.orbitControl.minDistance = 10;
            this.orbitControl.maxDistance = 30;
            this.orbitControl.autoRotate = true;
            this.orbitControl.enableKeys = false;
            this.orbitControl.enablePan = false;
            this.orbitControl.enableZoom = false;
            this.orbitControl.dispose();

            init( function () {
                scope.orbitControl.update();
            } );

            scope.camera.position.set( 0, 20, 60 );
        };

        /**
         *
         * @param {function} renderCallback
         * @returns {void}
         */
        function init( renderCallback ) {

            scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
            scope.container.appendChild( scope.renderer.domElement );

            addCamera();
            addLight();

            var fps = 30;

            setTimeout(function tick() {

                var delta = scope.clock.getDelta();

                if ( renderCallback ) {
                    renderCallback.call( this, delta );
                }

                scope.renderer.render( scope.scene, scope.camera );

                setTimeout(tick, 1000 / fps);

            }, 1000 / fps);
        }

        this.showGridHelper = function (flag) {
            if (flag !== false) {
                var color = new THREE.Color( 0xCCCCCC );
                var grid = new THREE.GridHelper( 6500, 50, color, 0x666666 );
                scope.scene.add( grid );
            }
        };

        /**
         *
         * @returns {void}
         */
        function addCamera() {

            scope.camera.position.set( 0, 20, -60 );
            scope.camera.fov = 60;
            scope.camera.near = 1;
            scope.camera.far = 100000;
            scope.camera.aspect = scope.getAspect();
            scope.camera.lookAt( scope.scene.position );
            scope.camera.updateProjectionMatrix();
        }

        /**
         *
         * @returns {void}
         */
        function addLight() {

            var light = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 1 );
            light.position.set( 0, 1000, 0 );
            scope.scene.add( light );
        }

        /**
         *
         * @returns {void}
         */
        function windowResize () {
            scope.camera.aspect = scope.getAspect();
            scope.camera.updateProjectionMatrix();
            scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
        }

        /**
         *
         * @returns {void}
         */
        function contextMenu( e ) {
            if ( scope._lock ) {
                e.preventDefault();
            }
        }

        /**
         *
         * @returns {void}
         */
        function keyDown( e ) {

            switch ( e.which ) {
                case 123:
                    if ( scope._lock ) {
                        e.preventDefault();
                    }
                    break;
                case 122:
                    if ( scope._lock ) {
                        e.preventDefault();
                    }
                    break;
            }
        }

        /**
         *
         * @param {number} value (0 - 1)
         * @returns {IW.SceneControls}
         */
        this.setOpacity = function ( value ) {
            this.container.style.opacity = value;
            return this;
        };

        window.addEventListener( 'resize', windowResize, false );
        document.addEventListener( 'contextmenu', contextMenu, false );
        document.addEventListener( 'keydown', keyDown, false );
    };

    // CITIES
    IW.SceneControls.MODEL_G1_A = 'G1_A';
    // SHIPS
    IW.SceneControls.MODEL_S1_A = 'S1_A';
    IW.SceneControls.MODEL_S1_B = 'S1_B';
    IW.SceneControls.MODEL_S1_C = 'S1_C';
    IW.SceneControls.MODEL_S1_D = 'S1_D';


