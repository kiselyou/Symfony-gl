/**
 * @param {string} idElement
 * @param {boolean} [lock]
 * @constructor
 */
THREE.SceneControls = function ( idElement, lock ) {

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
     * @type {THREE.SceneControls}
     */
    var scope = this;

    var flyControls = null;

    /**
     *
     * @type {THREE.MultiLoader}
     */
    var loader = new THREE.MultiLoader( this.scene );

    loader.addLoad( THREE.SceneControls.MODEL_G1_A, '/web/models/G1/A/', 'city.obj', 'city.mtl' );
    // SHIPS
    loader.addLoad( THREE.SceneControls.MODEL_S1_A, '/web/models/S1/A/', 'starship.obj', 'starship.mtl' );
    loader.addLoad( THREE.SceneControls.MODEL_S1_B, '/web/models/S1/B/', 'starship.obj', 'starship.mtl' );
    loader.addLoad( THREE.SceneControls.MODEL_S1_C, '/web/models/S1/C/', 'starship.obj', 'starship.mtl' );
    loader.addLoad( THREE.SceneControls.MODEL_S1_D, '/web/models/S1/D/', 'starship.obj', 'starship.mtl' );
    // ROCKETS
    loader.addLoad( THREE.SceneControls.MODEL_R1_A, '/web/models/R1/A/', 'rocket.obj', 'rocket.mtl' );
    loader.addLoad( THREE.SceneControls.MODEL_R1_B, '/web/models/R1/B/', 'rocket.obj', 'rocket.mtl' );
    loader.addLoad( THREE.SceneControls.MODEL_R1_C, '/web/models/R1/C/', 'rocket.obj', 'rocket.mtl' );

    loader.setLoadedCallback( function ( params ) {
        switch ( params.name ) {

            case THREE.SceneControls.MODEL_G1_A:
                params.object.scale.copy( new THREE.Vector3( 50, 50, 50 ) );
                params.object.position.z = 50000;
                params.object.position.y = -2900;
                scope.scene.add( params.object );
                break;

            case THREE.SceneControls.MODEL_S1_A:
                params.object.children[0].position.y = -80;
                break;

            case THREE.SceneControls.MODEL_S1_B:

                params.object.position.x = -400;
                params.object.children[0].rotation.x = 90 * Math.PI / 180;
                params.object.children[0].rotation.y = Math.PI;
                params.object.scale.copy( new THREE.Vector3( 25, 25, 25 ) );

                scope.scene.add( params.object );
                break;

            case THREE.SceneControls.MODEL_S1_C:

                params.object.position.x = 400;
                params.object.scale.copy( new THREE.Vector3( 25, 25, 25 ) );
                scope.scene.add( params.object );
                break;

            case THREE.SceneControls.MODEL_S1_D:

                params.object.position.x = -800;
                params.object.children[0].rotation.y = Math.PI;
                params.object.children[0].rotation.x = 90 * Math.PI / 180;
                params.object.scale.copy( new THREE.Vector3( 25, 25, 25 ) );
                scope.scene.add( params.object );
                break;

            case THREE.SceneControls.MODEL_R1_A:
                params.object.scale.copy( new THREE.Vector3( 5, 5, 5 ) );
                break;

            case THREE.SceneControls.MODEL_R1_B:
                params.object.children[0].rotation.y = Math.PI;
                break;

            case THREE.SceneControls.MODEL_R1_C:
                params.object.children[0].rotation.y = 90 * Math.PI / 180;
                break;
        }
    } );

    loader.load(function () {

        flyControls = new THREE.FlyControls( scope.scene, loader, scope.camera, scope.renderer.domElement );
        flyControls.initOrbitControl();
        flyControls.initPanel();

        initScene();

    });


    window.addEventListener( 'resize', windowResize, false );
    document.addEventListener( 'contextmenu', contextMenu, false );
    document.addEventListener( 'keydown', keyDown, false );

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
    function initScene() {

        scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
        scope.container.appendChild( scope.renderer.domElement );

        initCamera();
        initLight();
        render();
    }

    var clock = new THREE.Clock();

    /**
     *
     * @returns {void}
     */
    function render() {
        requestAnimationFrame( render );

        if ( flyControls ) {
            var delta = clock.getDelta();
            flyControls.update( delta );
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
THREE.SceneControls.MODEL_G1_A = 'G1_A';
// SHIPS
THREE.SceneControls.MODEL_S1_A = 'S1_A';
THREE.SceneControls.MODEL_S1_B = 'S1_B';
THREE.SceneControls.MODEL_S1_C = 'S1_C';
THREE.SceneControls.MODEL_S1_D = 'S1_D';

// ROCKETS
THREE.SceneControls.MODEL_R1_A = 'R1_A';
THREE.SceneControls.MODEL_R1_B = 'R1_B';
THREE.SceneControls.MODEL_R1_C = 'R1_C';