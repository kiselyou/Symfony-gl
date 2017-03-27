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

    loader.addPath( '/web/models/M1/ship.obj' );
    loader.addPath( '/web/models/M1/Spaceship1.obj' );
    loader.addPath( '/web/models/M1/walera.obj' );


    loader.objectLoaded = function ( object ) {
//            console.log( object );
    };

    loader.load(function () {

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
    }

    /**
     *
     * @returns {void}
     */
    function render() {
        requestAnimationFrame( render );
        scope.renderer.render( scope.scene, scope.camera );
    }

    /**
     *
     * @returns {void}
     */
    function initCamera() {

        scope.camera.position.x = 100;
        scope.camera.position.z = 100;
        scope.camera.position.y = 100;
        scope.camera.fov = 45;
        scope.camera.near = 0.1;
        scope.camera.far = 1000000;
        scope.camera.aspect = scope.getAspect();
        scope.camera.lookAt( scope.scene.position );
        scope.camera.updateProjectionMatrix();
        scope.scene.add( scope.camera );
    }

    function initLight() {

        // LIGHT
        var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 500, 0 );
        scope.scene.add( hemiLight );

        // LIGHT
        var dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -1, 1.75, 1 );
        dirLight.position.multiplyScalar( 5 );

        scope.scene.add( dirLight );

        var color = new THREE.Color( 0x00ffff );
        var grid = new THREE.GridHelper( 1000, 100, color, 0x888888 );
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