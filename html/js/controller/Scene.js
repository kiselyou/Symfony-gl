var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Scene = function ( idElement ) {

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
        window.addEventListener( 'resize', windowResize, false );
        document.addEventListener( 'contextmenu', contextMenu, false );
        document.addEventListener( 'keydown', keyDown, false );
        return this;
    };

    /**
     * Init scene
     *
     * @returns {IW.Scene}
     */
    this.init = function ( renderCallback ) {
        this.show();
        this.renderer.setSize( this.getWidth(), this.getHeight() );
        this.container.appendChild( this.renderer.domElement );

        setCamera();
        setLight();
        render();

        var fps = 30;

        setTimeout(function tick() {

            var delta = scope.clock.getDelta();

            if ( renderCallback ) {
                renderCallback.call( this, delta );
            }

            setTimeout(tick, 1000 / fps);

        }, 1000 / fps);
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
};