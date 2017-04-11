    var IW = IW || {};
    /**
     * @param {string} idElement
     * @param {boolean} [lock]
     * @constructor
     */
    IW.SceneControls = function ( idElement, lock ) {

        /**
         *
         * @type {boolean}
         * @private
         */
        this._lock = lock;

        /**
         *
         * @type {Scene}
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
        this.renderer = new THREE.WebGLRenderer();

        /**
         *
         * @type {PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera();

        /**
         *
         * @type {IW.SceneControls}
         */
        var scope = this;

        var flyControls = null;

        window.addEventListener( 'resize', windowResize, false );
        document.addEventListener( 'contextmenu', contextMenu, false );
        document.addEventListener( 'keydown', keyDown, false );

        this.initFlyControl = function ( multiLoader ) {

            flyControls = new IW.FlyControls( scope.scene, multiLoader, scope.camera, scope.renderer.domElement );
            flyControls.initOrbitControl();
            flyControls.initPanel();
        };

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
         * @returns {void}
         */
        this.initScene = function () {

            scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
            scope.container.appendChild( scope.renderer.domElement );

            initCamera();
            initLight();
            render();
        };

        /**
         *
         * @type {null}
         */
        var callbackUpdate = null;

        /**
         *
         * @param callback
         */
        this.setCallbackUpdate = function ( callback ) {
            callbackUpdate = callback;
        };

        var clock = new THREE.Clock();

        /**
         *
         * @returns {void}
         */
        function render() {
            requestAnimationFrame( render );

            var delta = clock.getDelta();

            if ( flyControls ) {
                flyControls.update( delta );
            }

            if ( callbackUpdate ) {
                callbackUpdate.call( this, delta );
            }

            scope.renderer.render( scope.scene, scope.camera );
        }

        /**
         *
         * @returns {void}
         */
        function initCamera() {

            scope.camera.position.x = 0;
            scope.camera.position.z = -2500;
            scope.camera.position.y = 1000;
            scope.camera.fov = 45;
            scope.camera.near = 0.1;
            scope.camera.far = 100000;
            scope.camera.aspect = scope.getAspect();
            scope.camera.lookAt( scope.scene.position );
            scope.camera.updateProjectionMatrix();
            // scope.scene.add( scope.camera );
        }

        function initLight() {

            var light = new THREE.HemisphereLight( 0xFFFFFF, 0x000000, 1 );
            light.position.set( 0, 500, 0 );
            scope.scene.add( light );

            var color = new THREE.Color( 0xCCCCCC );
            var grid = new THREE.GridHelper( 6500, 50, color, 0x666666 );
            scope.scene.add( grid );
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
    };

    // CITIES
    IW.SceneControls.MODEL_G1_A = 'G1_A';
    // SHIPS
    IW.SceneControls.MODEL_S1_A = 'S1_A';
    IW.SceneControls.MODEL_S1_B = 'S1_B';
    IW.SceneControls.MODEL_S1_C = 'S1_C';
    IW.SceneControls.MODEL_S1_D = 'S1_D';

    // ROCKETS
    IW.SceneControls.MODEL_R1_A = 'R1_A';
    IW.SceneControls.MODEL_R1_B = 'R1_B';
    IW.SceneControls.MODEL_R1_C = 'R1_C';