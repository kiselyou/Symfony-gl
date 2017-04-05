    /**
     * @param {Camera} camera
     * @param {Element} [container]
     * @constructor
     */
    THREE.LabelControls = function ( camera, container ) {

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

        var width = 60;
        var height = 60;

        /**
         *
         * @type {THREE.LabelControls}
         */
        var scope = this;

        this.templateAim = function ( label ) {
            var div = document.createElement('div');
            div.setAttribute(ATTR_DATA, 'aim');
            div.classList.add('sw-aim');
            div.style.position = 'absolute';
            div.style.width = width + 'px';
            div.style.height = height + 'px';
            div.style.top = -1000;
            div.style.left = -1000;
            div.innerHTML = label;
            return div;
        };

        this.templateSpeed = function ( label ) {
            var div = document.createElement('div');
            div.setAttribute(ATTR_DATA, 'speed');
            div.classList.add('sw-label-speed');
            div.style.position = 'absolute';
            div.style.width = width + 'px';
            div.style.height = height + 'px';
            div.style.top = -1000;
            div.style.left = -1000;
            div.innerHTML = label;
            console.dir(div);
            return div;
        };

        this.templateLabel = function ( label ) {
            var div = document.createElement('div');
            div.setAttribute(ATTR_DATA, 'label');
            div.classList.add('sw-label-speed');
            div.style.position = 'absolute';
            div.style.width = width + 'px';
            div.style.height = height + 'px';
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
         * @param {string} name - possible values ('aim'|'speed'|'label')
         * @param {string|number} label
         * @returns {THREE.LabelControls}
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
         * @returns {THREE.LabelControls}
         */
        this.updatePosition = function( name, position ) {

            if ( !this.element ) {
                return this;
            }

            if( this.parent ) {
                this.position.copy( this.parent.position );
            }

            if ( position ) {
                this.position.copy( position );
            }

            var coordinates = getCoordinates( this.position, scope._camera );
            var element = getElement( name );
            element.style.left = ( coordinates.x - ( width / 2 ) ) + 'px';
            element.style.top = ( coordinates.y - ( height / 2 ) ) + 'px';
            return this;
        };

        /**
         *
         * @param {string} name - possible values ('aim'|'speed'|'label')
         * @param {string|number} [text] - It is text of label
         * @param {Vector3} [position] - default position
         * @returns {THREE.LabelControls}
         */
        this.append = function ( name, text, position ) {

            switch ( name ) {
                case 'aim':
                    this.element.push(this.templateAim( text ));
                    break;
                case 'speed':
                    this.element.push(this.templateSpeed( text ));
                    break;
                case 'label':
                    this.element.push(this.templateLabel( text ));
                    break;
                default:
                    console.warn( 'You set not correct name in method append(). Possible values - aim|speed|label' );
                    break;
            }


            if ( position ) {
                this.updatePosition( name, position );
            }

            this._container.appendChild( getElement( name ) );
            return this;
        };

        this.addClass = function ( htmlClass ) {

        };

        /**
         *
         * @param {string} name - possible values ('aim'|'speed'|'label')
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