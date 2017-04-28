var IW = IW || {};
/**
 * @param {Camera} camera
 * @param {Element} [container]
 * @constructor
 */
IW.Labels = function ( camera, container ) {

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
     * @type {IW.Labels}
     */
    var scope = this;

    this.templateAim = function ( label ) {
        var div = document.createElement('div');
        div.setAttribute(ATTR_DATA, IW.Labels.TPL_AIM);
        div.classList.add('sw-aim');
        div.style.position = 'absolute';
        div.style.top = -1000;
        div.style.left = -1000;
        div.innerHTML = label;
        return div;
    };

    this.templateSpeed = function ( label ) {
        var div = document.createElement('div');
        div.setAttribute(ATTR_DATA, IW.Labels.TPL_SPEED);
        div.classList.add('sw-label-speed');
        div.style.position = 'absolute';
        div.style.top = -1000;
        div.style.left = -1000;
        div.innerHTML = label;
        return div;
    };

    this.templateDistance = function ( label ) {

        var div = document.createElement('div');
        div.setAttribute(ATTR_DATA, IW.Labels.TPL_DISTANCE);
        div.classList.add('sw-label-distance');
        div.style.position = 'absolute';
        div.style.top = -1000;
        div.style.left = -1000;
        div.innerHTML = label;
        return div;
    };

    this.templateLabel = function ( label ) {
        var div = document.createElement('div');
        div.setAttribute(ATTR_DATA, IW.Labels.TPL_LABEL);
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
     * @param {string} name - possible values (IW.Labels.TPL_AIM|IW.Labels.TPL_SPEED|IW.Labels.TPL_LABEL|IW.Labels.TPL_DISTANCE)
     * @param {string|number} label
     * @returns {IW.Labels}
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
     *                      IW.Labels.POSITION_L |
     *                      IW.Labels.POSITION_LT |
     *                      IW.Labels.POSITION_LB |
     *                      IW.Labels.POSITION_R |
     *                      IW.Labels.POSITION_RT |
     *                      IW.Labels.POSITION_RB |
     *                      IW.Labels.POSITION_C
     *                      {eft: number, top: number}
     * @returns {IW.Labels}
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
                case IW.Labels.POSITION_L:
                    w -= ew + ew / 2;
                    h -= eh / 2;
                    break;
                case IW.Labels.POSITION_LT:
                    w -= ew + ew / 2;
                    h -= eh;
                    break;
                case IW.Labels.POSITION_LB:
                    w -= ew + ew / 2;
                    h += eh;
                    break;
                case IW.Labels.POSITION_R:
                    w += ew;
                    h -= eh / 2;
                    break;
                case IW.Labels.POSITION_RT:
                    w += ew;
                    h -= eh;
                    break;
                case IW.Labels.POSITION_RB:
                    w += ew;
                    h += eh;
                    break;
                case IW.Labels.POSITION_C:
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
     * @param {string} name - possible values (IW.Labels.TPL_AIM|IW.Labels.TPL_SPEED|IW.Labels.TPL_LABEL|IW.Labels.TPL_DISTANCE)
     * @param {string|number} [text] - It is text of label
     * @param {Vector3} [position] - default position
     * @param {!{left: number, top: number}|string} [offset] - possible values:
     *                      IW.Labels.POSITION_L |
     *                      IW.Labels.POSITION_LT |
     *                      IW.Labels.POSITION_LB |
     *                      IW.Labels.POSITION_R |
     *                      IW.Labels.POSITION_RT |
     *                      IW.Labels.POSITION_RB |
     *                      IW.Labels.POSITION_C
     *                      {eft: number, top: number}
     * @returns {IW.Labels}
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
            case IW.Labels.TPL_AIM:
                scope.element.push(scope.templateAim( text ));
                break;
            case IW.Labels.TPL_SPEED:
                scope.element.push(scope.templateSpeed( text ));
                break;
            case IW.Labels.TPL_DISTANCE:
                scope.element.push(scope.templateDistance( text ));
                break;
            case IW.Labels.TPL_LABEL:
                scope.element.push(scope.templateLabel( text ));
                break;
            default:
                console.warn( 'You set not correct name in method append(). Possible values - aim|speed|label' );
                break;
        }
    }

    /**
     *
     * @param {string} name - possible values (IW.Labels.TPL_AIM|IW.Labels.TPL_SPEED|IW.Labels.TPL_LABEL|IW.Labels.TPL_DISTANCE)
     * @returns {Element}
     */
    function getElement( name ) {
        var element = scope.element.find( function ( element ) {
            return element.getAttribute(ATTR_DATA) == name;
        } );
        if (!element) {
            console.warn('Can not find element "IW.Labels"');
        }
        return element;
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
IW.Labels.TPL_AIM = 'aim';

/**
 * Template
 *
 * @const {string}
 */
IW.Labels.TPL_SPEED = 'speed';

/**
 * Template
 *
 * @const {string}
 */
IW.Labels.TPL_DISTANCE = 'distance';

/**
 * Template
 *
 * @const {string}
 */
IW.Labels.TPL_LABEL = 'label';

/**
 * Position
 *
 * @type {string}
 */
IW.Labels.POSITION_L = 'left';

/**
 * Position
 *
 * @type {string}
 */
IW.Labels.POSITION_LT = 'left|top';

/**
 * Position
 *
 * @type {string}
 */
IW.Labels.POSITION_LB = 'left|bottom';

/**
 * Position
 *
 * @type {string}
 */
IW.Labels.POSITION_R = 'right';

/**
 * Position
 *
 * @type {string}
 */
IW.Labels.POSITION_RT = 'right|top';

/**
 * Position
 *
 * @type {string}
 */
IW.Labels.POSITION_RB = 'right|bottom';

/**
 * Position
 *
 * @type {string}
 */
IW.Labels.POSITION_C = 'center';