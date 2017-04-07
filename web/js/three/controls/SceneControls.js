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


    var group = null;
    var group2 = null;
    var shockwaveGroup = null;
    var fireball = null;

    loader.load(function () {

        model = loader.getModel('mi-starship');
        model.add( scope.camera );

        flyControls = new THREE.FlyControls( model, scope.camera, scope.renderer.domElement );
        flyControls.initOrbitControl();
        scope.scene.add(model);

        var city = loader.getModel('city');
        city.position.x = 15000;
        city.position.z = -15000;
        city.position.y = -1100;
        city.scale.set(20, 20, 20);
        scope.scene.add(city);

        city = loader.getModel('city');
        city.position.x = -15000;
        city.position.z = 15000;
        city.position.y = -1100;
        city.scale.set(20, 20, 20);
        scope.scene.add(city);

        city = loader.getModel('city');
        city.position.x = 15000;
        city.position.z = 15000;
        city.position.y = -1100;
        city.scale.set(20, 20, 20);
        scope.scene.add(city);

        city = loader.getModel('city');
        city.position.x = -15000;
        city.position.z = -15000;
        city.position.y = -1100;
        city.scale.set(20, 20, 20);
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








        var gui = new dat.GUI();








        group = new SPE.Group( {
                texture: {
                    value: THREE.ImageUtils.loadTexture( '/web/images/effects/sprite-explosion2.png' ),
                    frames: new THREE.Vector2( 5, 5 ),
                    loop: 1
                },
                depthTest: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                scale: 600
            } );

        shockwaveGroup = new SPE.Group( {
                texture: {
                    value: THREE.ImageUtils.loadTexture( '/web/images/effects/smokeparticle.png' )
                },
                depthTest: false,
                depthWrite: true,
                blending: THREE.NormalBlending
            } );

        var shockwave = new SPE.Emitter( {
                particleCount: 200,
                type: SPE.distributions.DISC,
                position: {
                    radius: 5,
                    spread: new THREE.Vector3( 5 )
                },
                maxAge: {
                    value: 2,
                    spread: 0
                },
                // duration: 1,
                activeMultiplier: 2000,
                velocity: {
                    value: new THREE.Vector3( 40 )
                },
                rotation: {
                    axis: new THREE.Vector3( 1, 0, 0 ),
                    angle: Math.PI * 0.5,
                    static: true
                },
                size: { value: 2 },
                color: {
                    value: [
                        new THREE.Color( 0.4, 0.2, 0.1 ),
                        new THREE.Color( 0.2, 0.2, 0.2 )
                    ]
                },
                opacity: { value: [0.5, 0.2, 0] }
            });

        var debris = new SPE.Emitter( {
                particleCount: 100,
                type: SPE.distributions.SPHERE,
                position: {
                    radius: 0.1
                },
                maxAge: {
                    value: 2
                },
                // duration: 2,
                activeMultiplier: 40,
                velocity: {
                    value: new THREE.Vector3( 100 )
                },
                acceleration: {
                    value: new THREE.Vector3( 0, -20, 0 ),
                    distribution: SPE.distributions.BOX
                },
                size: { value: 2 },
                drag: {
                    value: 1
                },
                color: {
                    value: [
                        new THREE.Color( 1, 1, 1 ),
                        new THREE.Color( 1, 1, 0 ),
                        new THREE.Color( 1, 0, 0 ),
                        new THREE.Color( 0.4, 0.2, 0.1 )
                    ]
                },
                opacity: { value: [0.4, 0] }
            });

        fireball = new SPE.Emitter( {
                particleCount: 20,
                type: SPE.distributions.DISC,
                position: {
                    radius: 1
                },
                maxAge: { value: 2 },
                // duration: 1,
                activeMultiplier: 20,
                velocity: {
                    value: new THREE.Vector3( 10 )
                },
                size: { value: [50, 200] },
                color: {
                    value: [
                        new THREE.Color( 0.5, 0.1, 0.05 ),
                        new THREE.Color( 0.2, 0.2, 0.2 )
                    ]
                },
                opacity: { value: [0.5, 0.35, 0.1, 0] }
            });

        var mist = new SPE.Emitter( {
                particleCount: 50,
                position: {
                    spread: new THREE.Vector3( 10, 10, 10 ),
                    distribution: SPE.distributions.SPHERE
                },
                maxAge: { value: 2 },
                // duration: 1,
                activeMultiplier: 2000,
                velocity: {
                    value: new THREE.Vector3( 8, 3, 10 ),
                    distribution: SPE.distributions.SPHERE
                },
                size: { value: 40 },
                color: {
                    value: new THREE.Color( 0.2, 0.2, 0.2 )
                },
                opacity: { value: [0, 0, 0.2, 0] }
            });

        var flash = new SPE.Emitter( {
                particleCount: 50,
                position: { spread: new THREE.Vector3( 5, 5, 5 ) },
                velocity: {
                    spread: new THREE.Vector3( 30 ),
                    distribution: SPE.distributions.SPHERE
                },
                size: { value: [2, 20, 20, 20] },
                maxAge: { value: 2 },
                activeMultiplier: 2000,
                opacity: { value: [0.5, 0.25, 0, 0] }
            } );

        group.addEmitter( fireball ).addEmitter( flash );
        shockwaveGroup.addEmitter( debris ).addEmitter( mist );


        shockwaveGroup.mesh.position.setX( 75 );
        shockwaveGroup.mesh.position.setY( 70 );
        shockwaveGroup.mesh.position.setZ( -250 );


        group.mesh.position.setX( 75 );
        group.mesh.position.setY( 70 );
        group.mesh.position.setZ(-250);

        group2 = group.mesh.clone();
        group2.position.setX( -75 );
        group2.position.setY( 70 );
        group2.position.setZ(-250);

        model.children[0].add( shockwaveGroup.mesh );
        model.children[0].add( group.mesh );
        model.children[0].add( group2 );



        var m = gui.addFolder( 'Fire Ball' );

        m.add( fireball, 'particleCount', 1.0, 80.0, 1.0 ).name( 'Particle Count' ).onChange( changeGui );
        m.add( fireball, 'type', [ 'SPHERE', 'BOX', 'DISC' ]).name( 'Type' ).onChange( changeGui );

        var r = gui.addFolder( 'Position' );
        r.add( fireball.position, 'radius', 0, 1, 0.01).name( 'Radius' ).onChange( changeGui );

        var a = gui.addFolder( 'Age' );
        a.add( fireball.maxAge, 'value', 1, 10, 0.5).name( 'Value' ).onChange( changeGui );

        var mp = gui.addFolder( 'Multiplier' );
        mp.add( fireball, 'activeMultiplier', 1, 100, 1).name( 'Active Multiplier' ).onChange( changeGui );

        var v = gui.addFolder( 'Velocity' );
        v.add( fireball.velocity.value, 'x', 1, 100, 1).name( 'value_X' ).onChange( changeGui );
        // v.add( fireball.velocity.value, 'y', 1, 100, 1).name( 'value-Y' ).onChange( changeGui );
        // v.add( fireball.velocity.value, 'z', 1, 100, 1).name( 'value-Z' ).onChange( changeGui );

        // var s = gui.addFolder( 'Size' );
        // s.add( fireball.size.value, 0, 1, 100, 1).name( 'size - X' ).onChange( changeGui );
        // s.add( fireball.size.value, 1, 1, 100, 1).name( 'size - Y' ).onChange( changeGui );







































































































        initScene();

    });

    function changeGui(e) {
        switch (e) {
            case 'SPHERE':
                fireball.type = SPE.distributions.SPHERE;
                break;
            case 'BOX':
                fireball.type = SPE.distributions.BOX;
                break;
            case 'DISC':
                fireball.type = SPE.distributions.DISC;
                break;
        }
    }


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

        if (group) {
            group.tick();
            // group2.tick();
        }

        if (shockwaveGroup) {
            shockwaveGroup.tick();
        }


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