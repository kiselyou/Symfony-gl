/**
 * @param {string} idElement
 * @param {boolean} [lock]
 * @constructor
 */
THREE.SceneControl  = function ( idElement, lock ) {

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
     * @type {THREE.SceneControl}
     */
    var scope = this;

    /**
     *
     * @type {THREE.ModelsLoader}
     */
    var loader = new THREE.ModelsLoader( this.scene );

    loader.addLoad( 'm1-ship', '/web/models/M1/ship.obj' );
    loader.addLoad( 'm1-spaceship', '/web/models/M1/Spaceship1.obj' );
    loader.addLoad( 'm1-walera', '/web/models/M1/walera.obj' );


    loader.objectLoaded = function ( uploaded ) {

    };

    loader.load(function () {

        scope.scene.add( loader.getModel( 'm1-spaceship' ) );

        var miniMap = new THREE.MiniMap();
        miniMap.appendTo();

        var panel = new THREE.PanelControl( miniMap );

        panel.addAction( function () {

            new ui.FullScreen().toggle();

        }, null, 'fullscreen', null, true );

        panel.addProgress( 1, 'energy', 2000, 25, '#FF9900' );
        panel.addProgress( 2, 'armor', 4000, 20, '#008AFA' );
        panel.addProgress( 3, 'hull', 1000, 10, '#C10020' );
        panel.appendTo();

        initScene();

    });


    window.addEventListener( 'resize', windowResize, false );
    document.addEventListener('contextmenu', contextMenu, false );
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

        initOrbitControl();
    }

    /**
     *
     * @returns {void}
     */
    function render() {
        requestAnimationFrame( render );

        if ( orbitControl ) {

            orbitControl.update();
        }

        scope.renderer.render( scope.scene, scope.camera );
    }

    /**
     *
     * @returns {void}
     */
    function initCamera() {

        scope.camera.position.x = 0;
        scope.camera.position.z = -30;
        scope.camera.position.y = 15;
        scope.camera.fov = 45;
        scope.camera.near = 0.1;
        scope.camera.far = 1000000;
        scope.camera.aspect = scope.getAspect();
        scope.camera.lookAt( scope.scene.position );
        scope.camera.updateProjectionMatrix();
        scope.scene.add( scope.camera );
    }

    var orbitControl = null;

    function initOrbitControl() {

        orbitControl = new THREE.OrbitControls( scope.camera, scope.renderer.domElement );
        orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
        orbitControl.enablePan = false;
        orbitControl.enableKeys = false;
        orbitControl.minDistance = 30;
        orbitControl.maxPolarAngle = 75 * Math.PI / 180;
        orbitControl.maxDistance = 300;
        orbitControl.rotateSpeed = 3.0;
    }

    function initLight() {

        var light = new THREE.HemisphereLight( 0xFFFFFF, 0x000000, 1 );
        light.position.set( 0, 500, 0 );
        scope.scene.add( light );

        var color = new THREE.Color( 0xCCCCCC );
        var grid = new THREE.GridHelper( 500, 50, color, 0x666666 );
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