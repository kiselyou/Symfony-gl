/**
 *
 * @param {Camera} camera
 * @param {Mesh} plane
 * @param {HTMLDocument} domElement
 * @constructor
 */
THREE.CameraControls = function ( camera, plane, domElement ) {

    /** @type {Camera} */
    this.camera = camera;

    /** @type {Mesh} */
    this.plane = plane;

    /** @type {HTMLDocument} */
    this.domElement = domElement;

    /** @type {Number} */
    this.width = this.domElement.width;

    /** @type {Number} */
    this.height = this.domElement.height;

    /** @type {THREE.CameraControls} */
    var scope = this;

    /** @type {Array} */
    this.activeArea = [
        {
            area: '0|20',
            step: 10
        },
        {
            area: '20|40',
            step: 5
        },
        {
            area: '40|50',
            step: 2.5
        },
        {
            area: '50|60',
            step: 1.25
        },
        {
            area: '60|70',
            step: 0.5
        }
    ];

    /**
     *
     * @param {Number} [width]
     * @param {Number} [height]
     * @returns {void}
     */
    this.listen = function ( width, height ) {
        if ( width != undefined ) {
            this.width = width;
        }

        if ( height != undefined ) {
            this.height = height;
        }

        this.domElement.addEventListener( 'mousemove', moveCamera, false );
    };

    /**
     *
     * @returns {void}
     */
    this.update = function () {
        if ( params.move ) {

            var a = params.point.x - this.camera.position.x;
            var b = params.point.z - this.camera.position.z;
            var len = Math.sqrt( a * a + b * b );

            var ox = a / len * params.step;
            var oz = b / len * params.step;

            this.camera.position.x += ox;
            this.camera.position.z += oz;

        }
    };

    var params = {
        move: false,
        step: 0,
        point: new THREE.Vector3()
    };

    /**
     *
     * @param {MouseEvent} e
     */
    function moveCamera( e ) {
        var bottom = scope.height;
        var right = scope.width;

        var clientY = e.clientY;
        var clientX = e.clientX;

        var activeArea, area, min, max;
        var len = scope.activeArea.length;

        for ( var i = 0; i < len; i++ ) {
            activeArea = scope.activeArea[ i ];
            area = activeArea.area.split( '|' );
            min = area[ 0 ];
            max = area[ 1 ];

            // top
            if ( clientY >= min && clientY < max ) {
                params.move = true;
                params.step = activeArea.step;
                params.point = getClickPosition( e, scope.camera, scope.plane );
            }
            // bottom
            if ( clientY >= ( bottom - max ) && clientY < ( bottom - min ) ) {
                params.move = true;
                params.step = - activeArea.step;
                params.point = getClickPosition( e, scope.camera, scope.plane );
            }
            // left
            if ( clientX >= min && clientX < max ) {
                params.move = true;
                params.step = activeArea.step;
                params.point = getClickPosition( e, scope.camera, scope.plane );
            }
            // right
            if ( clientX >= ( right - max ) && clientX < ( right - min ) ) {
                params.move = true;
                params.step = activeArea.step;
                params.point = getClickPosition( e, scope.camera, scope.plane );
            }
        }

        if ( scope.activeArea[ len - 1 ] ) {
            activeArea = scope.activeArea[ len - 1 ];
            area = activeArea.area.split( '|' );
            max = area[ 1 ];
            if ( ( clientY > max && clientY < ( bottom - max ) ) && ( clientX > max && clientX < ( right - max ) ) ) {
                params.step = 0;
                params.move = false;
            }
        }
    }

    /**
     *
     * @param {MouseEvent} event
     * @param {Camera} camera
     * @param {Mesh} plane
     * @returns {(Vector3|boolean)}
     */
    function getClickPosition( event, camera, plane ) {

        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObject( plane );
        if ( intersects.length > 0 ) {
            return intersects[0]['point'];
        }
        return false;
    }

};