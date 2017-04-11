    var IW = IW || {};
    /**
     * @param {Camera} camera
     * @param {Element} [container]
     * @constructor
     */
    IW.LabelControls = function ( camera, container ) {

        /**
         *
         * @const {string}
         */
        var ATTR_DATA = 'data-template-name';

        /**
         *
         * @type {Camera}
         * @private
         */
        this._camera = camera;

        /**
         * @type {Element}
         */
        this._container = ( container != undefined ) ? container : document.body;

        /**
         *
         * @type {Array.<Element>}
         */
        this.element = [];

        /**
         *
         * @type {Vector3}
         */
        this.position = new THREE.Vector3( 0, 0, 0 );

        /**
         *
         * @type {?Mesh}
         */
        this.parent = null;

        /**
         *
         * @type {IW.LabelControls}
         */
        var scope = this;

        this.templateAim = function ( label ) {
            var div = document.createElement('div');
            div.setAttribute(ATTR_DATA, IW.LabelControls.TPL_AIM);
            div.classList.add('sw-aim');
            div.style.position = 'absolute';
            div.style.top = -1000;
            div.style.left = -1000;
            div.innerHTML = label;
            return div;
        };

        this.templateSpeed = function ( label ) {
            var div = document.createElement('div');
            div.setAttribute(ATTR_DATA, IW.LabelControls.TPL_SPEED);
            div.classList.add('sw-label-speed');
            div.style.position = 'absolute';
            div.style.top = -1000;
            div.style.left = -1000;
            div.innerHTML = label;
            return div;
        };

        this.templateDistance = function ( label ) {

            var div = document.createElement('div');
            div.setAttribute(ATTR_DATA, IW.LabelControls.TPL_DISTANCE);
            div.classList.add('sw-label-distance');
            div.style.position = 'absolute';
            div.style.top = -1000;
            div.style.left = -1000;
            div.innerHTML = label;
            return div;
        };

        this.templateLabel = function ( label ) {
            var div = document.createElement('div');
            div.setAttribute(ATTR_DATA, IW.LabelControls.TPL_LABEL);
            div.classList.add('sw-label-speed');
            div.style.position = 'absolute';
            div.style.top = -1000;
            div.style.left = -1000;
            div.innerHTML = label;
            return div;
        };

        /**
         *
         * @param {Mesh} object
         * @returns {void}
         */
        this.setParent = function( object ) {
            this.parent = object;
        };

        /**
         *
         * @param {string} name - possible values (IW.LabelControls.TPL_AIM|IW.LabelControls.TPL_SPEED|IW.LabelControls.TPL_LABEL|IW.LabelControls.TPL_DISTANCE)
         * @param {string|number} label
         * @returns {IW.LabelControls}
         */
        this.updateLabel = function( name, label ) {
            var element = getElement( name );
            element.innerHTML = label;
            return this;
        };

        /**
         *
         * @param {string} name
         * @param {Vector3} [position]
         * @param {!{left: number, top: number}|string} [offset] - possible values:
         *                      IW.LabelControls.POSITION_L |
         *                      IW.LabelControls.POSITION_LT |
         *                      IW.LabelControls.POSITION_LB |
         *                      IW.LabelControls.POSITION_R |
         *                      IW.LabelControls.POSITION_RT |
         *                      IW.LabelControls.POSITION_RB |
         *                      IW.LabelControls.POSITION_C
         *                      {eft: number, top: number}
         * @returns {IW.LabelControls}
         */
        this.updatePosition = function( name, position, offset ) {

            if ( !this.element ) {
                return this;
            }

            if( this.parent ) {
                this.position.copy( this.parent.position );
            }

            if ( position ) {
                this.position.copy( position );
            }

            var element = getElement( name );
            var coordinates = getCoordinates( this.position, scope._camera );

            var w = coordinates.x;
            var h = coordinates.y;
            var ew = element.offsetWidth;
            var eh = element.offsetHeight;

            if ( typeof offset == 'string' ) {

                switch ( offset ) {
                    case IW.LabelControls.POSITION_L:
                        w -= ew + ew / 2;
                        h -= eh / 2;
                        break;
                    case IW.LabelControls.POSITION_LT:
                        w -= ew + ew / 2;
                        h -= eh;
                        break;
                    case IW.LabelControls.POSITION_LB:
                        w -= ew + ew / 2;
                        h += eh;
                        break;
                    case IW.LabelControls.POSITION_R:
                        w += ew;
                        h -= eh / 2;
                        break;
                    case IW.LabelControls.POSITION_RT:
                        w += ew;
                        h -= eh;
                        break;
                    case IW.LabelControls.POSITION_RB:
                        w += ew;
                        h += eh;
                        break;
                    case IW.LabelControls.POSITION_C:
                        w -= ew / 2;
                        h -= eh / 2;
                        break;
                }
            } else if ( typeof offset == 'object' ) {

                w += offset.left;
                h += offset.top;
            }

            element.style.left = w + 'px';
            element.style.top = h + 'px';
            return this;
        };

        /**
         *
         * @param {string} name - possible values (IW.LabelControls.TPL_AIM|IW.LabelControls.TPL_SPEED|IW.LabelControls.TPL_LABEL|IW.LabelControls.TPL_DISTANCE)
         * @param {string|number} [text] - It is text of label
         * @param {Vector3} [position] - default position
         * @param {!{left: number, top: number}|string} [offset] - possible values:
         *                      IW.LabelControls.POSITION_L |
         *                      IW.LabelControls.POSITION_LT |
         *                      IW.LabelControls.POSITION_LB |
         *                      IW.LabelControls.POSITION_R |
         *                      IW.LabelControls.POSITION_RT |
         *                      IW.LabelControls.POSITION_RB |
         *                      IW.LabelControls.POSITION_C
         *                      {eft: number, top: number}
         * @returns {IW.LabelControls}
         */
        this.append = function ( name, text, position, offset ) {

            setElement( name, text );

            if ( position ) {
                this.updatePosition( name, position, offset );
            }

            this._container.appendChild( getElement( name ) );
            return this;
        };

        this.addClass = function ( htmlClass ) {

        };

        /**
         *
         * @param {string} name
         * @param {string} text
         */
        function setElement( name, text ) {
            switch ( name ) {
                case IW.LabelControls.TPL_AIM:
                    scope.element.push(scope.templateAim( text ));
                    break;
                case IW.LabelControls.TPL_SPEED:
                    scope.element.push(scope.templateSpeed( text ));
                    break;
                case IW.LabelControls.TPL_DISTANCE:
                    scope.element.push(scope.templateDistance( text ));
                    break;
                case IW.LabelControls.TPL_LABEL:
                    scope.element.push(scope.templateLabel( text ));
                    break;
                default:
                    console.warn( 'You set not correct name in method append(). Possible values - aim|speed|label' );
                    break;
            }
        }

        /**
         *
         * @param {string} name - possible values (IW.LabelControls.TPL_AIM|IW.LabelControls.TPL_SPEED|IW.LabelControls.TPL_LABEL|IW.LabelControls.TPL_DISTANCE)
         * @returns {Element}
         */
        function getElement( name ) {
            return scope.element.find( function ( element ) {
                return element.getAttribute(ATTR_DATA) == name;
            } );
        }

        /**
         *
         * @param {Vector3} position
         * @param {Camera} camera
         * @returns {Vector2}
         */
        function getCoordinates( position, camera ) {
            var vector = position.project( camera );
            vector.x = ( vector.x + 1 ) / 2 * window.innerWidth;
            vector.y = -( vector.y - 1 ) / 2 * window.innerHeight;
            return vector;
        }
    };

    /**
     * Template
     *
     * @const {string}
     */
    IW.LabelControls.TPL_AIM = 'aim';

    /**
     * Template
     *
     * @const {string}
     */
    IW.LabelControls.TPL_SPEED = 'speed';

    /**
     * Template
     *
     * @const {string}
     */
    IW.LabelControls.TPL_DISTANCE = 'distance';

    /**
     * Template
     *
     * @const {string}
     */
    IW.LabelControls.TPL_LABEL = 'label';

    /**
     * Position
     *
     * @type {string}
     */
    IW.LabelControls.POSITION_L = 'left';

    /**
     * Position
     *
     * @type {string}
     */
    IW.LabelControls.POSITION_LT = 'left|top';

    /**
     * Position
     *
     * @type {string}
     */
    IW.LabelControls.POSITION_LB = 'left|bottom';

    /**
     * Position
     *
     * @type {string}
     */
    IW.LabelControls.POSITION_R = 'right';

    /**
     * Position
     *
     * @type {string}
     */
    IW.LabelControls.POSITION_RT = 'right|top';

    /**
     * Position
     *
     * @type {string}
     */
    IW.LabelControls.POSITION_RB = 'right|bottom';

    /**
     * Position
     *
     * @type {string}
     */
    IW.LabelControls.POSITION_C = 'center';