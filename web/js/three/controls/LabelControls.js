    /**
     * @param {Camera} camera
     * @param {Element} [container]
     * @constructor
     */
    THREE.LabelControls = function ( camera, container ) {

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
         * @type {Element}
         */
        this.element = null;

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

        this.buildLabel = function ( label ) {
            var div = document.createElement('div');
            div.classList.add('sw-aim');
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
         * @param {string} label
         * @returns {THREE.LabelControls}
         */
        this.updateLabel = function( label ) {
            this.element.innerHTML = label;
            return this;
        };

        /**
         *
         * @param {Vector3} [position]
         * @returns {THREE.LabelControls}
         */
        this.updatePosition = function( position ) {

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
            this.element.style.left = ( coordinates.x - ( width / 2 ) ) + 'px';
            this.element.style.top = ( coordinates.y - ( height / 2 ) ) + 'px';
            return this;
        };

        /**
         *
         * @param {string|number} label
         * @param {Vector3} [position]
         * @returns {THREE.LabelControls}
         */
        this.appendTo = function ( label, position ) {

            this.element = this.buildLabel( label );

            if ( position ) {
                this.updatePosition( position );
            }

            this._container.appendChild( this.element );
            return this;
        };

        this.addClass = function ( htmlClass ) {

        };

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