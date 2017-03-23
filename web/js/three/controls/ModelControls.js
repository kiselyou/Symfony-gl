/**
 *
 * @param {Camera} camera
 * @param {Scene} scene
 * @param {HTMLDocument} domElement
 * @param {Element} container
 * @constructor
 */
THREE.ModelControls = function ( camera, scene, domElement, container ) {

    /**
     *
     * @type {number}
     */
    var FIX = 8;

    /**
     *
     * @type {number}
     */
    var SCALE = 1000;

    /**
     *
     * @type {number}
     */
    var LEFT = 0;

    /**
     *
     * @type {number}
     */
    var RIGHT = 1;

    /**
     *
     * @type {number}
     */
    var DIRECT = 2;

    /**
     *
     * @type {Camera}
     */
    this.camera = camera;

    /**
     *
     * @type {Scene}
     */
    this.scene = scene;

    /**
     *
     * @type {?Mesh}
     */
    this.object = null;

    /**
     *
     * @type {HTMLDocument}
     */
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    /**
     *
     * @type {Element}
     * @private
     */
    this._container = container;

    /**
     *
     * @type {Vector3}
     */
    this.previousPosition = new THREE.Vector3( 0, 0, -1 );

    /**
     *
     * @type {boolean}
     */
    this.showPoint = false;

    /**
     *
     * @type {boolean}
     */
    this.showLine = false;

    /**
     *
     * @type {?Mesh}
     */
    this.plane = null;

	/**
     *
     * @type {THREE.ModelData}
     */
    this.modelData = new THREE.ModelData();

    /**
     *
     * @type {{WATCH_FOR_MODEL: number, CHOOSE: number}}
     */
    this.keys = {
        CHOOSE: 17,
        WATCH_FOR_MODEL: 32
    };

    /**
     *
     * @type {{HOVER_CURSOR: string, DEFAULT_CURSOR: string, CHOOSE_ELEMENT_COLOR: number}}
     */
    this.effects = {
        HOVER_CURSOR: 'pointer',
        DEFAULT_CURSOR: 'default',
        CHOOSE_ELEMENT_COLOR: 0xFF00FF
    };

    /** @type {boolean} */
    var chooseElement = false;

    /** @type {Array} */
    var intersectExceptUUID = [];

    /** @type {THREE.ModelControls} */
    var scope = this;

    var orbitControl = null;

    function constructor() {

    }

    constructor();

    /**
     *
     * @param {string} uuid
     * @return {THREE.ModelControls}
     */
    this.addIntersectExceptUUID = function ( uuid ) {
        intersectExceptUUID.push( uuid );
        return this;
    };

    /**
     *
     * @param {string} path
     * @param {function} [callback]
     */
    this.loadObject = function ( path, callback ) {
        var manager = new THREE.LoadingManager();
        var loader = new THREE.OBJLoader( manager );
        loader.load( path, function ( object ) {
            object.rotation.x = 90 * Math.PI / 180;
            object.rotation.y = 180 * Math.PI / 180;

            var geometry = new THREE.SphereGeometry( 12, 25, 25 );
            var material = new THREE.MeshLambertMaterial( { color: 0x4AB5E2, opacity: 0.1, transparent: true } );
            scope.object = new THREE.Mesh( geometry, material );

            if ( callback ) {
                callback.call( this, object );
            }

            scope.object.add( object );
            scope.scene.add( scope.object );

            var planeGeometry = new THREE.PlaneGeometry( 10000, 10000 );
            var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 0, transparent: true });
            // var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
            scope.plane = new THREE.Mesh( planeGeometry, planeMaterial );
            scope.plane.rotation.x = -0.5 * Math.PI;
            scope.object.add( scope.plane );



            intersectExceptUUID.push( scope.plane.uuid );
            intersectExceptUUID.push( scope.object.uuid );

            orbitControl = new THREE.OrbitControls( scope.camera, scope.domElement );
            orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
//            orbitControl.enablePan = false;
//            orbitControl.enableKeys = false;
            orbitControl.minDistance = 20;
            orbitControl.keyPanSpeed = 70;
            orbitControl.maxPolarAngle = 65 * Math.PI / 180;
            orbitControl.maxDistance = 500;
            orbitControl.rotateSpeed = 3.0;

            scope.mouseMoveModel();

        });
    };

    /**
     *
     * @returns {?Mesh}
     */
    this.getModel = function () {
        return this.object;
    };

    /**
     *
     * @returns {Vector3}
     */
    this.getPreviousPosition = function () {
        return this.previousPosition;
    };

    /**
     *
     * @returns {number}
     */
    this.getAngleRotate = function () {

        var angle = params.angleStart + ( Math.PI / 2 );

        switch ( params.direction ) {
            case LEFT:
                angle = params.angleStart - ( Math.PI / 2 );
                break;
        }

        return angle;
    };

    /**
     *
     * @returns {void}
     */
    this.mouseMoveModel = function () {
        this.dispose();
        window.addEventListener( 'keydown', onKeyDown, false );
        window.addEventListener( 'keyup', onKeyUp, false );
        this.domElement.addEventListener( 'click', moveModel, false );

    };

    /**
     *
     * @returns {void}
     */
    this.dispose = function () {

        window.removeEventListener( 'keydown', onKeyDown, false );
        window.removeEventListener( 'keyup', onKeyUp, false );
        this.domElement.removeEventListener( 'click', moveModel, false );

    };

    /**
     *
     * @type {?Mesh}
     */
    var autoFly = null;

    /**
     *
     * @param {Mesh} object
     * @return {THREE.ModelControls}
     */
    this.autoFlyTo = function ( object ) {
        autoFly = object;
        return this;
    };

    /**
     *
     * @return {THREE.ModelControls}
     */
    this.stopAutoFly = function () {
        autoFly = null;
        return this;
    };

    /**
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    function moveModel ( event ) {

        if ( chooseElement ) {
            var objectIntersected = scope.getIntersect(
                event,
                function ( element ) {
                    activeObject( element, scope.effects.CHOOSE_ELEMENT_COLOR );
                },
                function () {
                    clearActiveObject();
                }
            );
            if ( objectIntersected ) {
                scope.autoFlyTo(objectIntersected);
                return;
            } else {
                clearActiveObject();
                scope.stopAutoFly();
            }

        } else {
            clearActiveObject();
            scope.stopAutoFly();
        }

        var pointA = scope.previousPosition;
        var pointB = scope.object.position;
        var pointC = scope.getClickPosition( event, scope.camera, scope.plane );

        if ( !pointC ) {
            return;
        }

        drawPointClick( pointC );
        scope.move( pointA, pointB, pointC );
    }

    var watchForModel = false;

	/**
     *
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    function onKeyDown ( event ) {

        document.addEventListener( 'mousemove', onMouseMove, false );

        switch ( event.keyCode ) {
            case scope.keys.CHOOSE:
                chooseElement = true;
                break;
            case scope.keys.WATCH_FOR_MODEL:
                watchForModel = true;
                break;
        }

        setAdditionalEvents( scope.EVENT_KEY_DOWN, event );
    }

    /**
     *
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    function onKeyUp ( event ) {

        document.removeEventListener( 'mousemove', onMouseMove, false );

        switch ( event.keyCode ) {
            case scope.keys.CHOOSE:
                chooseElement = false;
                scope.domElement.style.cursor = scope.effects.DEFAULT_CURSOR;
                break;
            case scope.keys.WATCH_FOR_MODEL:
                watchForModel = false;
                break;
        }

        setAdditionalEvents( scope.EVENT_KEY_UP, event );
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    function onMouseMove ( event ) {

        var objectIntersected = scope.getIntersect( event );

        if ( objectIntersected ) {

            scope.domElement.style.cursor = scope.effects.HOVER_CURSOR;

        } else {

            scope.domElement.style.cursor = scope.effects.DEFAULT_CURSOR;

        }

        setAdditionalEvents( scope.EVENT_MOUSE_MOVE, event );
    }

    /**
     * Stop model
     *
     * @returns {void}
     */
    function stopModel () {
        params.run = false;
    }

    /** @const {string} */
    this.EVENT_MOUSE_MOVE = 'mouse_move';

    /** @const {string} */
    this.EVENT_KEY_DOWN = 'key_down';

    /** @const {string} */
    this.EVENT_KEY_UP = 'key_up';

    /**
     * @type {*}
     */
    var eventsModel = {};

    /**
     *
     * @param {string} type - possible values ('mouse_move'|'key_down'|'key_up')
     * @param {MouseEvent|KeyboardEvent} event
     * @returns {void}
     */
    function setAdditionalEvents( type, event ) {

        if ( eventsModel.hasOwnProperty( type ) ) {

            var additionEvent = eventsModel[ type ];

            for ( var i = 0; i < additionEvent.length; i++ ) {

                additionEvent[ i ].call( this, event, scope );
            }
        }
    }

    /**
     * Callback for adding events of model.
     *
     * @callback additionalEventsToModel
     * @param {MouseEvent|KeyboardEvent} event - Mouse event
     * @param {THREE.ModelControls} scope - It current instance ModelControl
     */

    /**
     *
     * @param {string} type - possible values ('mouse_move'|'key_down'|'key_up')
     * @param {additionalEventsToModel} callback
     * @returns {THREE.ModelControls}
     */
    this.addEventToModel = function ( type, callback ) {

        if ( !eventsModel.hasOwnProperty( type ) ) {

            eventsModel[ type ] = [];
        }

        eventsModel[ type ].push( callback );
        return this;
    };

    /**
     *
     * @param {Vector3} va
     * @param {Vector3} vb
     * @param {Vector3} vc
     */
    this.move = function ( va, vb, vc ) {

        toFixed( va );
        toFixed( vb );
        toFixed( vc );

        // Ignore same click
        if ( params.points.c.equals( vc ) ) {
            return;
        }

        var dir = direction( va, vb, vc );

        // -------------------------------------------------------------------------------------------------------------
        var modelRadius = this.modelData.getRadius();
        var d = va.distanceTo( vb );
        var radius = Math.sqrt( d * d +  modelRadius * modelRadius );
        var p = getPointIntersectionOfCircles( va, radius, vb, modelRadius );
        var vr = null;

        switch ( dir ) {
            case LEFT:
                vr = p[ 0 ];
                break;
            default:
                vr = p[ 1 ];
                break
        }

        if ( vr.equals( new THREE.Vector3() ) ) {
            console.warn( 'Point R has coordinate 0, 0, 0' );
            return;
        }

        // -------------------------------------------------------------------------------------------------------------

        var r = cutRadius( vb, vr, vc, modelRadius );
        radius = Math.sqrt( d * d +  r * r );
        p = getPointIntersectionOfCircles( va, radius, vb, r );

        switch ( dir ) {
            case LEFT:
                vr = p[ 0 ];
                break;
            default:
                vr = p[ 1 ];
                break
        }

        if ( vr.equals( new THREE.Vector3() ) ) {
            console.warn( 'Point R - (cut) has coordinate 0, 0, 0' );
            return;
        }

        // -------------------------------------------------------------------------------------------------------------

        d = vr.distanceTo( vc );
        p = getPointIntersectionOfCircles( vc, Math.sqrt( Math.abs( d * d - r * r ) ), vr, r );
        var vd = null;

        switch ( dir ) {
            case LEFT:
                vd = p[ 0 ];
                break;
            default:
                vd = p[ 1 ];
                break;
        }

        if ( vd.equals( new THREE.Vector3() ) ) {
            console.warn( 'Point D has coordinate 0, 0, 0' );
            return;
        }

        // -------------------------------------------------------------------------------------------------------------

        drawPoint( vr, '#0000FF', this.showPoint );
        drawPoint( vd, '#FFFF00', this.showPoint );
        drawPoint( vc, '#FF0000', this.showPoint );

        var color = '#00FF00';
        drawLine ( va, vb, color, this.showLine );
        drawLine ( vb, vr, color, this.showLine );
        drawLine ( vr, vd, color, this.showLine );
        drawLine ( vd, vc, color, this.showLine );

        // -------------------------------------------------------------------------------------------------------------

        params.direction = dir;
        params.radius = r;
        params.points.a = va;
        params.points.b = vb;
        params.points.r = vr;
        params.points.d = vd;
        params.points.c = vc;
        params.angleStart = angleAxis( vr, vb );

        // -------------------------------------------------------------------------------------------------------------

        var angle = anglePoints( va, vb, vd );

        if ( ( angle * 180 / Math.PI ) > 90 ) {
            params.angleStop = anglePoints( vb, vr, vd );
        } else if ( ( angle * 180 / Math.PI ) < 90 ) {
            params.angleStop = 2 * Math.PI - anglePoints( vb, vr, vd );
        } else {
            params.angleStop = Math.PI;
        }

        // -------------------------------------------------------------------------------------------------------------

        params.percentCutRadius = 100 - ( r * 100 / modelRadius );
        params.step = stepRotate(params.angleStop, r, this.modelData.getSpeedRotate( params.percentCutRadius ) );
        params.speed = this.modelData.getSpeedDirect();
        params.maxIncline = this.modelData.getMaxIncline();
        params.speedIncline = this.modelData.getSpeedIncline( params.percentCutRadius );

        params.startIteration = 0;
        params.arcLengthMax = arcLength( params.angleStop, r );
        params.arcLengthMin = arcLength( params.step, r );
        params.endIteration = Math.floor( params.arcLengthMax / params.arcLengthMin );

        // -------------------------------------------------------------------------------------------------------------
        params.run = true;
    };

    var raycaster = new THREE.Raycaster();

    /**
     *
     * @param {MouseEvent} event
     * @param {Camera} camera
     * @param {Mesh} plane
     * @returns {(Vector3|boolean)}
     */
    this.getClickPosition = function ( event, camera, plane ) {

        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObject( plane );
        if ( intersects.length > 0 ) {
            return intersects[0]['point'];
        }
        return false;
    };

    /**
     *
     * @param {MouseEvent} event
     * @param {function} [callbackIntersected]
     * @param {function} [callbackNoIntersected]
     * @return {?Mesh}
     */
    this.getIntersect = function ( event, callbackIntersected, callbackNoIntersected ) {

        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, scope.camera );
        var intersects = raycaster.intersectObjects( scope.scene.children );

        var elements = intersects.filter( function ( value ) {
            return intersectExceptUUID.indexOf( value.object.uuid ) < 0;
        } );

        if ( elements.length > 0 ) {

            var element = elements[ 0 ].object;

            if ( callbackIntersected ) {
                callbackIntersected.call(this, element, elements );
            }

            return element;

        } else {

            if ( callbackNoIntersected ) {
                callbackNoIntersected.call( this );
            }

        }

        return null;
    };

    /**
     *
     * @type {?Mesh}
     */
    var TEMP_ELEMENT = null;

    /**
     *
     * @param {Mesh} object
     * @param {(string|number)} [color]
     * @returns {void}
     */
    function activeObject( object, color ) {

        if ( TEMP_ELEMENT != object ) {

            if ( TEMP_ELEMENT ) {
                TEMP_ELEMENT.material.color.setHex(TEMP_ELEMENT.currentHex);
            }

            TEMP_ELEMENT = object;
            TEMP_ELEMENT.currentHex = TEMP_ELEMENT.material.color.getHex();
            TEMP_ELEMENT.material.color.setHex( color == undefined ? 0xff0000 : color );

        }
    }

    /**
     *
     * @returns {void}
     */
    function clearActiveObject() {

        if ( TEMP_ELEMENT ) {
            TEMP_ELEMENT.material.color.setHex( TEMP_ELEMENT.currentHex );
        }

        TEMP_ELEMENT = null;
    }

	/**
     *
     * @type {{run: boolean, direction: number, angleStart: number, radius: number, step: number, startIteration: number, endIteration: number, arcLengthMax: number, arcLengthMin: number, lookAt: (*|Vector3), points: {r: (*|Vector3), d: (*|Vector3), c: (*|Vector3)}}}
     */
    var params = {
        run: false,
        speed: 0,
        speedIncline: 0,
        maxIncline: 0,
        direction: LEFT,
        angleStart: 0,
        radius: 0,
        percentCutRadius: 0,
        step: 0,
        startIteration: 0,
        endIteration: 0,
        arcLengthMax: 0,
        arcLengthMin: 0,
        rotate: 0,
        lookAt: new THREE.Vector3(),
        points: {
            a: new THREE.Vector3(),
            b: new THREE.Vector3(),
            r: new THREE.Vector3(),
            d: new THREE.Vector3(),
            c: new THREE.Vector3()
        }
    };

    /**
     * This method should run in requestAnimationFrame
     *
     * @return {void}
     */
    this.update = function () {

        if ( orbitControl ) {
            if ( watchForModel ) {
                orbitControl
                    .stopMoveCamera()
                    .moveCameraTo( scope.getModel() );
            }
            orbitControl.update();
        }

        if ( autoFly ) {
            scope.move( scope.previousPosition, scope.object.position, autoFly.position );
            drawPointClick( autoFly.position );
        }


        animationPointClick();

        if ( this.textlabel ) {
            this.textlabel.setHTML( ( scope.object.position.distanceTo( params.points.c )  * 10 ).toFixed( 2 ) );
            this.textlabel.updatePosition();
        }

        if ( !params.run ) {
            return;
        }

        if ( params.startIteration <= params.endIteration ) {
            params.startIteration++;

            var x = params.points.r.x + params.radius * Math.cos( params.angleStart );
            var z = params.points.r.z + params.radius * Math.sin( params.angleStart );

            this.previousPosition.setX( this.object.position.x );
            this.previousPosition.setZ( this.object.position.z );

            this.object.position.x = x;
            this.object.position.z = z;

            drawPoint( this.object.position, '#00FF00', this.showPoint );

            switch ( params.direction ) {
                case LEFT:

                    if ( params.startIteration <= params.endIteration / 2 ) {

                        if ( this.modelData.getIncline() > - params.maxIncline ) {

                            this.object.children[0].rotateY( - params.speedIncline );
                            this.modelData.increaseIncline( - params.speedIncline );

                        }

                    } else {

                        if ( this.modelData.getIncline() < 0 ) {

                            this.object.children[0].rotateY( params.speedIncline );
                            this.modelData.increaseIncline( params.speedIncline );

                        }

                    }

                    params.angleStart -= params.step;
                    lookAt( -params.step );
                    break;
                default:

                    if ( params.startIteration <= params.endIteration / 2 ) {

                        if ( this.modelData.getIncline() < params.maxIncline ) {

                            this.object.children[0].rotateY( params.speedIncline );
                            this.modelData.increaseIncline( params.speedIncline );

                        }

                    } else {

                        if ( this.modelData.getIncline() > 0 ) {

                            this.object.children[0].rotateY( - params.speedIncline );
                            this.modelData.increaseIncline( - params.speedIncline );

                        }

                    }

                    params.angleStart += params.step;
                    lookAt( params.step );
                    break;
            }

        } else {
            if ( this.modelData.getIncline() > 0 ) {
                this.object.children[0].rotateY( - params.speedIncline );
                this.modelData.increaseIncline( - params.speedIncline );
            }

            if ( this.modelData.getIncline() < 0 ) {
                this.object.children[0].rotateY( params.speedIncline );
                this.modelData.increaseIncline( params.speedIncline );
            }

            var a = params.points.c.x - this.object.position.x;
            var b = params.points.c.z - this.object.position.z;
            var len = distance( a, b );

            var ox = a / len * params.speed;
            var oz = b / len * params.speed;

            var step = distance( ox, oz );
            if ( len > 0 && len < step ) {
                ox = a / step * ( params.speed / 2 );
                oz = b / step * ( params.speed / 2 );
                removeTextLabel();
                removePointClick();
            }

            this.previousPosition.setX( params.points.d.x );
            this.previousPosition.setZ( params.points.d.z );

            params.lookAt.setX( params.points.c.x );
            params.lookAt.setZ( params.points.c.z );
            scope.object.lookAt( params.lookAt );

            this.object.position.x += ox;
            this.object.position.z += oz;

            drawPoint( this.object.position, '#00FF00', this.showPoint );

            var startLen = Number( params.points.d.distanceTo( params.points.c ).toFixed( 4 ) );
            var currentLen = Number( params.points.d.distanceTo( params.points.b ).toFixed( 4 ) );

            if ( !autoFly && ( currentLen >= startLen || len.toFixed( 2 ) <= 0 ) ) {
                stopModel();
            }
        }
    };

    /**
     * This method calculate next position of object and is directing it there
     *
     * @param {number} step
     */
    function lookAt ( step ) {

        if ( params.startIteration < params.endIteration ) {
            var x = params.points.r.x + Math.cos(params.angleStart + step) * params.radius;
            var z = params.points.r.z + Math.sin(params.angleStart + step) * params.radius;
            params.lookAt.setX( x );
            params.lookAt.setZ( z );

        } else {
            params.lookAt.setX( params.points.c.x );
            params.lookAt.setZ( params.points.c.z );
        }

        scope.object.lookAt( params.lookAt );
    }

    /**
     * Get side position C from vector AB
     *
     * @param {Vector3} va
     * @param {Vector3} vb
     * @param {Vector3} vc
     * @returns {number}
     */
    function direction ( va, vb, vc ) {
        var side = ( vc.x - va.x ) * ( vb.z - va.z ) - ( vc.z - va.z ) * ( vb.x - va.x );
        if ( side < 0 ) {
            return RIGHT;    // Point C is right side from line AB
        } else if ( side > 0 ) {
            return LEFT;     // Point C is left side from line AB
        } else {
            return DIRECT;   // Point C is on line AB
        }
    }

    /**
     * This method find points intersection of circle
     *
     * @param {Vector3} va - point
     * @param {number} ra - radius
     * @param {Vector3} vb - point
     * @param {number} rb - radius
     */
    function getPointIntersectionOfCircles ( va, ra, vb, rb ) {
        var d = vb.distanceTo( va );
        var vector = new THREE.Vector3();

        if ( d == 0 || ( ra + rb ) < d || ( ra - rb ) > d ) {
            return [ vector.clone(), vector.clone() ];
        }

        var a = ( rb * rb - ra * ra + d * d ) / ( 2 * d );
        var h = Math.sqrt( rb * rb - a * a );

        var pv = vector.clone();
        pv.setX( vb.x + a * ( va.x - vb.x ) / d );
        pv.setZ( vb.z + a * ( va.z - vb.z ) / d );

        var left = vector.clone();
        left.setX( pv.x + - h * ( va.z - vb.z ) / d );
        left.setZ( pv.z - - h * ( va.x - vb.x ) / d );

        var right = vector.clone();
        right.setX( pv.x - - h * ( va.z - vb.z ) / d );
        right.setZ( pv.z + - h * ( va.x - vb.x ) / d );

        toFixed( left );
        toFixed( right );

        return [ left, right ];
    }

    /**
     * This method cut radius if point C is inside circle
     *
     * @param {Vector3} vb It is point B
     * @param {Vector3} vr It is point R
     * @param {Vector3} vc It id point C
     * @param {number} r It is radius
     * @returns {number}  Radius
     * @private
     */
    function cutRadius ( vb, vr, vc, r ) {
        var rc = vr.distanceTo( vc );
        if ( rc <= r || rc == 0 ) {
            return vb.distanceTo( vc ) / 3;
        }
        return r;
    }

    /**
     * Get an angle relative to the axis
     *
     * @param {Vector3} va
     * @param {Vector3} vb
     * @returns {number}
     */
    function angleAxis ( va, vb ) {
        var x0 = va.x,
            x = vb.x,
            z0 = va.z,
            z = vb.z,
            angle;

        if ( z0 === z ) {
            if ( x > x0 ) {
                angle = 0;
            } else if ( x < x0 ) {
                angle = 180 * Math.PI / 180;
            } else if ( x === x0) {
                angle = 0;
            }
        } else if ( x0 === x ) {
            if ( z > z0 ) {
                angle = 90 * Math.PI / 180;
            } else if ( z0 > z ) {
                angle = -90 * Math.PI / 180;
            } else {
                angle = 0;
            }
        } else {
            var a, b;

            if ( z0 > z && x > x0 ) {
                a = x - x0;
                b = z - z0;
                angle = Math.asin( b / Math.sqrt( a * a + b * b ) );
            } else if ( x > x0 && z > z0 ) {
                a = z - z0;
                b = x - x0;
                angle = Math.asin( a / Math.sqrt( a * a + b * b ) );
            } else if ( x0 > x && z > z0 ) {
                a = x - x0;
                b = z - z0;
                angle = ( Math.PI * 2 ) + Math.acos( a / Math.sqrt( a * a + b * b ) );
            } else if ( z0 > z && x0 > x ) {
                a = x - x0;
                b = z - z0;
                angle = ( Math.PI * 2 ) - Math.acos( a / Math.sqrt( a * a + b * b ) );
            }
        }

        return angle;
    }

    /**
     * Get angle ABC
     *
     * @param {Vector3} va
     * @param {Vector3} vb
     * @param {Vector3} vc
     * @returns {number}
     * @private
     */
    function anglePoints ( va, vb, vc ) {

        var ab = { x: vb.x - va.x, z: vb.z - va.z };
        var cd = { x: vc.x - vb.x, z: vc.z - vb.z };

        var a = Math.sqrt( ab.x * ab.x + ab.z * ab.z );
        var b = Math.sqrt( cd.x * cd.x + cd.z * cd.z );
        var c = va.distanceTo( vc );

        if ( a == 0 || b == 0 ) {
            return 0;
        }

        return Math.acos( ( a * a + b * b - c * c ) / ( 2 * a * b ) );
    }

    /**
     * This method calculate step of rotation
     *
     * @param {number} angle
     * @param {number} radius
     * @param {number} speed
     * @returns {number}
     */
    function stepRotate ( angle, radius, speed ) {
        var t = arcLength ( angle, radius ) / ( speed );
        return angle / t;
    }

    /**
     * Get length in meters
     *
     * @param {number} angle
     * @param {number} radius
     * @returns {number}
     */
    function arcLength ( angle, radius ) {
        return (radius * SCALE) * angle;
    }

    /**
     *
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    function distance ( a, b ) {
        return Math.sqrt( a * a + b * b ) * SCALE;
    }

    /**
     *
     *
     * @param {Vector3} v
     * @param {number} [fraction]
     */
    function toFixed ( v, fraction ) {
        fraction = fraction === undefined ? FIX : fraction;
        v.setX( Number( v.x.toFixed( fraction ) ) );
        v.setY( Number( v.y.toFixed( fraction ) ) );
        v.setZ( Number( v.z.toFixed( fraction ) ) );
    }

	/**
     *
     * @type {Mesh|null}
     */
    var pointClick = null;

	/**
	 *
     * @type {number}
     */
    var stepOpacity = 0.05;

	/**
     *
	 * @returns {void}
     */
    function animationPointClick () {
        if ( pointClick ) {
            if ( pointClick.material.opacity >= 1 ) {
                stepOpacity = -Math.abs(stepOpacity);
            }

            if ( pointClick.material.opacity <= 0 ) {
                stepOpacity = Math.abs(stepOpacity);
            }

            pointClick.material.transparent = true;
            pointClick.material.opacity += stepOpacity;
        }
    }

	/**
     * Draw point on place click of position
     *
     * @param {Vector3} position
     * @returns {void}
     */
    function drawPointClick ( position ) {
        removeTextLabel();
        removePointClick();
        pointClick = drawPoint( position, '#FF0000', true );

        var text = createTextLabel();
        text.setHTML( scope.object.position.distanceTo( position ).toFixed( 3 ) );
        text.setParent( pointClick );
        scope.textlabel = text;
        scope._container.appendChild( text.element );
    }

	/**
     *
     * @type {(null|{})}
     */
    this.textlabel = null;

	/**
     *
     * @returns {{element: Element, parent: (Mesh|boolean), position: (*|Vector3), setHTML: function, setParent: function, updatePosition: function, getCoordinates: function}}
     */
    function createTextLabel() {
        var div = document.createElement('div');
        div.className = 'text-label';
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.height = 100;
        div.style.top = -1000;
        div.style.left = -1000;

        return {
	        /**
             * @type {Element}
             */
            element: div,

	        /**
	         * @type {(Mesh|boolean)}
             */
            parent: false,

	        /**
	         * @type {Vector3}
             */
            position: new THREE.Vector3( 0, 0, 0 ),

	        /**
	         *
             * @param {string} html
             * @returns {void}
             */
            setHTML: function( html ) {
                this.element.innerHTML = html;
            },

	        /**
	         *
             * @param {Mesh} object
             * @returns {void}
             */
            setParent: function( object ) {
                this.parent = object;
            },

	        /**
             *
	         * @returns {void}
             */
            updatePosition: function() {
                if( this.parent ) {
                    this.position.copy( this.parent.position );
                    this.position.y = this.position.y + 2;
                }

                var coordinates = this.getCoordinates( this.position, scope.camera );
                this.element.style.left = coordinates.x + 'px';
                this.element.style.top = coordinates.y + 'px';
            },

	        /**
	         *
             * @param {Vector3} position
             * @param {Camera} camera
             * @returns {Vector2}
             */
            getCoordinates: function( position, camera ) {
                var vector = position.project( camera );
                vector.x = ( vector.x + 1 ) / 2 * window.innerWidth;
                vector.y = -( vector.y - 1 ) / 2 * window.innerHeight;
                return vector;
            }
        };
    }

	/**
     * Delete text label
     *
     * @returns {void}
     */
    function removeTextLabel() {
        if ( scope.textlabel ) {
            scope.textlabel.element.remove();
        }
    }

	/**
     * Delete point click of position
     *
     * @returns {void}
     */
    function removePointClick() {
        if ( scope.scene && pointClick ) {
            scope.scene.remove( pointClick );
        }
    }

    /**
     *
     * @param {Vector3} position
     * @param {string} color
     * @param {boolean} show
     * @returns {Mesh|null}
     */
    function drawPoint ( position, color, show ) {
        if ( !scope.scene || !show ) {
            return null;
        }

        var geometry = new THREE.SphereGeometry( 1, 15, 15, 0, Math.PI * 2, 0, Math.PI * 2 );
        var material = new THREE.MeshLambertMaterial( { color: color } );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.copy( position );
        scope.scene.add( sphere );
        return sphere;
    }

    /**
     *
     * @param {Vector3} a
     * @param {Vector3} b
     * @param {string} color
     * @param {boolean} show
     * @returns {void}
     */
    function drawLine ( a, b, color, show ) {
        if ( !scope.scene || !show ) {
            return;
        }

        var material = new THREE.LineBasicMaterial( { color: color } );
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3().copy( a ), new THREE.Vector3().copy( b ) );
        scope.scene.add( new THREE.Line( geometry, material ) );
    }
};