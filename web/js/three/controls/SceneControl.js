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

    var flyControls = null;

    /**
     *
     * @type {THREE.MultiLoader}
     */
    var loader = new THREE.MultiLoader( this.scene );

    loader.addLoad(
        'mi-starship',
        '/web/models/M1/cwwf1303rf28-W/Wraith Raider Starship/',
        'Wraith Raider Starship.obj',
        'Wraith_Raider_Starship.mtl'
    );

    loader.addLoad(
        'city',
        '/web/models/Organodron City/',
        'Organodron City.obj',
        'Organodron_City.mtl'
    );
    // loader.addLoad( 'm1-ship', '/web/models/M1/ship.obj' );
    // loader.addLoad( 'm1-combat', '/web/models/M1/Futuristic combat jet/Futuristic combat jet.obj' );
    // loader.addLoad( 'm1-spaceship', '/web/models/M1/Spaceship1.obj' );
    // loader.addLoad( 'm1-walera', '/web/models/M1/walera.obj' );
    // loader.addLoad( 'mi-starship', '/web/models/M1/cwwf1303rf28-W/Wraith Raider Starship/Wraith Raider Starship.obj' );
    // loader.addLoad( 'mi-FA-22_Raptor', '/web/models/M1/FA-22_Raptor/FA-22_Raptor.obj' );
    // loader.addLoad( 'mi-f14d', '/web/models/M1/Grumman F-14 Tomcat/f14d.obj' );
    //
    // loader.addLoad( 'AGM-114HellFire', '/web/models/rockets/AGM/files/AGM-114HellFire.obj' );
    // loader.addLoad( 'AVMT300', '/web/models/rockets/AVMT300/AVMT300.obj' );
    // loader.addLoad( 'AIM', '/web/models/rockets/AIM/AIM-9 SIDEWINDER.obj' );
    // loader.addLoad( 'AIM120D', '/web/models/rockets/AIM120D Missile/Files/AIM120D.obj' );
    // loader.addLoad( 'm1-MBDA', '/web/models/rockets/MissileMBDA Meteor/Files/Missile MBDA Meteor.obj' );
    // loader.addLoad( 'City', '/web/models/Organodron City/Organodron City.obj' );



    var a = 0;
    loader.objectLoaded = function ( uploaded ) {


        uploaded.object.position.x = a;
        a += 500;
        //
        // scope.scene.add( uploaded.object );
    };

    var model = null;

    loader.load(function () {

        model = loader.getModel('mi-starship');
        flyControls = new THREE.FlyControls( model, scope.camera, scope.renderer.domElement );
        flyControls.initOrbitControl();
        scope.scene.add(model);

        var city = loader.getModel('city');
        city.position.x = 500;
        scope.scene.add(city);

        city = loader.getModel('city');
        city.position.x = -500;
        scope.scene.add(city);

        city = loader.getModel('city');
        city.position.x = 500;
        city.position.z = 500;
        scope.scene.add(city);

        city = loader.getModel('city');
        city.position.x = -500;
        city.position.z = 500;
        scope.scene.add(city);



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
        scope.camera.position.z = -600;
        scope.camera.position.y = 350;
        scope.camera.fov = 45;
        scope.camera.near = 0.1;
        scope.camera.far = 1000000;
        scope.camera.aspect = scope.getAspect();
        scope.camera.lookAt( scope.scene.position );
        scope.camera.updateProjectionMatrix();
        scope.scene.add( scope.camera );
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