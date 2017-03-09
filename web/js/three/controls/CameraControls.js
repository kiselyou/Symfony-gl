/**
 *
 * @param {Camera} camera
 * @param {HTMLDocument} domElement
 * @constructor
 */
THREE.CameraControls = function ( camera, domElement ) {

    /**
     *
     * @type {Camera}
     */
    this.camera = camera;

    /**
     *
     * @type {HTMLDocument}
     */
    this.domElement = domElement;

    /**
     *
     * @type {Number}
     */
    this.width = this.domElement.width;

    /**
     *
     * @type {Number}
     */
    this.height = this.domElement.height;

    /**
     *
     * @type {THREE.CameraControls}
     */
    var scope = this;

    /**
     *
     * @type {*[]}
     */
    this.activeArea = [
        {
            area: '0|20',
            step: 20
        },
        {
            area: '20|40',
            step: 10
        },
        {
            area: '40|50',
            step: 15
        },
        {
            area: '50|60',
            step: 10
        },
        {
            area: '60|70',
            step: 5
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

    };

    var params = {
        move: false,
        step: 0,
        x: 0,
        y: 0
    };
    var step = 0;

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
                params.x
            }
            // bottom
            if ( clientY >= ( bottom - max ) && clientY < ( bottom - min ) ) {
                params.move = true;
                params.step = activeArea.step;
            }
            // left
            if ( clientX >= min && clientX < max ) {
                params.move = true;
                params.step = activeArea.step;
            }
            // right
            if ( clientX >= ( right - max ) && clientX < ( right - min ) ) {
                params.move = true;
                params.step = activeArea.step;
            }
        }

        if ( scope.activeArea[ len - 1 ] ) {
            activeArea = scope.activeArea[ len - 1 ];
            area = activeArea.area.split( '|' );
            max = area[ 1 ];
            if ( ( clientY > max && clientY < ( bottom - max ) ) && ( clientX > max && clientX < ( right - max ) ) ) {
                params.move = false;
                params.step = 0;
            }
        }
    }

};