var IW = IW || {};

/**
 *
 * @param {string} idContainer
 * @augments IW.SkyBox
 * @constructor
 */
IW.Scene = function ( idContainer ) {

    // Parent constructor
    IW.SkyBox.call( this );

    /**
     *
     * @type {THREE.Scene}
     */
    this.scene = new THREE.Scene();

    /**
     *
     * @type {Element}
     */
    this.container = document.getElementById( idContainer );

    /**
     *
     * @type {WebGLRenderer}
     */
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;

    /**
     *
     * @type {PerspectiveCamera}
     */
    this.camera = new THREE.PerspectiveCamera();

    /**
     *
     * @type {THREE.OrbitControls}
     */
    this.orbitControl = new THREE.OrbitControls( this.camera, this.renderer.domElement );

    /**
     *
     * @type {THREE.Clock}
     */
    this.clock = new THREE.Clock();

    /**
     *
     * @type {IW.Scene}
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
     * @param {number} value (0 - 1)
     * @returns {IW.Scene}
     */
    this.setOpacity = function ( value ) {
        this.container.style.opacity = value;
        return this;
    };

    /**
     * Hide scene
     *
     * @returns {IW.Scene}
     */
    this.hide = function () {
        this.setOpacity( 0 );
        return this;
    };

    /**
     * Show scene
     *
     * @returns {IW.Scene}
     */
    this.show = function () {
        var start = 0;
        var idInterval = setInterval( function () {
            start += 0.01;
            scope.setOpacity( start );
            if ( start >= 1 ) {
                scope.setOpacity( 1 );
                clearInterval( idInterval );
            }
        }, 20 );
        return this;
    };

    /**
     * This method sets additional events
     *
     * @returns {IW.Scene}
     */
    this.prod = function () {
        document.addEventListener( 'contextmenu', contextMenu, false );
        document.addEventListener( 'keydown', keyDown, false );
        return this;
    };

    /**
     * Call in request animation frame
     *
     * @param {number} delta
     * @callback animation
     */

    /**
     * Init scene
     *
     * @param {animation} [event]
     * @returns {IW.Scene}
     */
    this.init = function ( event ) {
        this.hide();
        this.renderer.setSize( this.getWidth(), this.getHeight() );
        this.container.appendChild( this.renderer.domElement );

        this.buildEnvironment( function ( environment ) {
            scope.scene.add( environment );
        } );

        setCamera();
        setLight();
        render();

        var fps = 30;
        var delay = 1000 / fps;

        setTimeout(function tick() {

            var delta = scope.clock.getDelta();

            if ( event ) {
                event.call( this, delta );
            }

            scope.orbitControl.update();

            setTimeout(tick, delay);

        }, delay);

        this.show();
        return this;
    };

    /**
     * Set config orbit controls for play
     *
     * @returns {IW.Scene}
     */
    this.playsConfigOrbitControl = function () {
        this.orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
        this.orbitControl.enablePan = false;
        this.orbitControl.enableKeys = false;
        this.orbitControl.rotateSpeed = 2.0;
        this.orbitControl.minDistance = 20;
        this.orbitControl.maxDistance = 60;
        this.orbitControl.maxPolarAngle = 75 * Math.PI / 180;
        this.orbitControl.minPolarAngle = 45 * Math.PI / 180;
        return this;
    };

    /**
     * Set config orbit controls for preview
     *
     * @returns {IW.Scene}
     */
    this.previewConfigOrbitControl = function () {
        this.orbitControl.autoRotateSpeed = 0.3;
        this.orbitControl.minDistance = 10;
        this.orbitControl.maxDistance = 30;
        this.orbitControl.autoRotate = true;
        this.orbitControl.enableKeys = false;
        this.orbitControl.enablePan = false;
        this.orbitControl.enableZoom = false;
        this.orbitControl.dispose();
        return this;
    };

    /**
     * This method run animation of scene
     *
     * @returns {void}
     */
    function render() {
        requestAnimationFrame( render );
        scope.renderer.render( scope.scene, scope.camera );
    }

    /**
     * Set configuration for camera and add to scene
     *
     * @returns {void}
     */
    function setCamera() {
        scope.camera.position.set( 0, 20, -60 );
        scope.camera.fov = 60;
        scope.camera.near = 1;
        scope.camera.far = 100000;
        scope.camera.aspect = scope.getAspect();
        scope.camera.lookAt( scope.scene.position );
        scope.camera.updateProjectionMatrix();
    }

    /**
     * Set configuration for lights and add to scene
     *
     * @returns {void}
     */
    function setLight() {
        var light = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 1 );
        light.position.set( 0, 1000, 0 );
        scope.scene.add( light );
    }

    /**
     * Set parameters for scene when user are resizing window
     *
     * @returns {void}
     */
    function windowResize() {
        scope.camera.aspect = scope.getAspect();
        scope.camera.updateProjectionMatrix();
        scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
    }

    /**
     * Disable context menu
     *
     * @returns {void}
     */
    function contextMenu( e ) {
        e.preventDefault();
    }

    /**
     * Additional event for keyDown in production
     *
     * @returns {void}
     */
    function keyDown( e ) {

        switch ( e.which ) {
            case 123:
                if ( scope.lock ) {
                    e.preventDefault();
                }
                break;
            case 122:
                if ( scope.lock ) {
                    e.preventDefault();
                }
                break;
        }
    }

    window.addEventListener( 'resize', windowResize, false );
};