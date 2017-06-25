    var IW = IW || {};

    /**
     *
     * @param {string} containerID
     * @constructor
     */
    IW.PanelAction = function ( containerID ) {

        this.iconBaseDir = '/app/images/textures';

        /**
         *
         * @type {number}
         */
        this.speedAutoUpdate = 1000;

        /**
         *
         * @type {boolean}
         */
        this.enabled = true;

        /**
         *
         * @type {string}
         */
        this.id = containerID;

        /**
         *
         * @type {Array}
         */
        var actions = [];

        /**
         *
         * @type {null|Element}
         */
        var panel = null;

        /**
         *
         * @type {IW.PanelAction}
         */
        var scope = this;

        /**
         *
         * @param {function} callback
         * @param {?(string|number)} [name]
         * @param {?(string|number)} [icon]
         * @param {?number} [keyCode]
         */
        this.addAction = function ( callback, name, icon, keyCode ) {

            actions.push(
                {
                    callback: callback,
                    name: name,
                    icon: icon,
                    keyCode: keyCode,
                    element: null
                }
            );
        };

        /**
         *
         * @returns {IW.PanelAction}
         */
        this.show = function () {

            var loader = new IW.Templates();

            loader.load(
                '/templates/panel/model-progress.html',
                function ( template ) {
                    $('#' + scope.id).prepend( templateProgress( template ) );
                }
            );

            loader.load(
                '/templates/panel/controls.html',
                function ( template ) {
                    $('#' + scope.id).prepend( templatePanelAction( template ) );
                }
            );

            autoReduction();

            return this;
        };

        /**
         *
         * @returns {Element}
         */
        function templatePanelAction( template ) {

            var block = $(template);
            var blockAction = block.find('[data-template="element"]').clone();
            blockAction.removeAttr('data-template');
            block.html('');

            for ( var i = 0; i < actions.length; i++ ) {

                var action = actions[ i ];

                var b = blockAction.clone();

                var iconElement = b.find( '[data-template="element-icon"]' );

                if ( action.icon ) {

                    iconElement.removeAttr('data-template');
                    iconElement.attr( 'src', scope.iconBaseDir + action.icon );


                    // var c = document.createElement('div');
                    // c.classList.add('sw-action-icon');
                    // c.classList.add('glyphicon');
                    // c.classList.add('glyphicon-' + action.icon);
                    // b.appendChild( c );
                } else {

                    iconElement.remove();
                }

                if ( action.name ) {

                    var keyElement = b.find( '[data-template="element-keyword"]' );
                    keyElement.removeAttr('data-template');
                    // data-template="element-icon"
                    keyElement.text( action.name );
                }

                block.append( b );

                if ( action.keyCode ) {
                    actions[ i ].element = b;
                    keyEvents.push( action );
                }

                addEvent( b, action );
            }

            return block;
        }

        /**
         *
         * @type {Array}
         */
        var keyEvents = [];

        /**
         *
         * @param {KeyboardEvent} e
         */
        function addKeyEvents( e ) {

            for ( var i = 0; i < keyEvents.length; i++ ) {
                if ( e.keyCode == keyEvents[ i ][ 'keyCode' ] ) {
                    keyEvents[ i ][ 'callback' ].call( this, keyEvents[ i ], e );
                }
            }
        }

        /**
         *
         * @param {Element} element
         * @param {*} action
         */
        function addEvent( element, action ) {

            $(element).on('click', function ( e ) {
                action.callback.call( this, action, e );
            });
        }

        /**
         *
         * @type {Array}
         */
        var progress = [];

        /**
         *
         * @returns {Element}
         */
        function templateProgress( template ) {

            var block = $(template);
            var hull = block.find('[data-template="progress-hull"]');
            var energy = block.find('[data-template="progress-energy"]');
            var power = block.find('[data-template="progress-power"]');
            var speed = block.find('[data-template="progress-speed"]');

            for ( var i = 0; i < progress.length; i++ ) {

                /**
                 *
                 * @type {{key: (string|number), label: string, value: number, max: =number, reduction: =number, color: =string, unit: =string }}
                 */
                var params = progress[ i ];

                switch (params.key) {
                    case 1:
                        params[ 'p' ] = energy.find('[data-template="range"]');
                        params[ 'type' ] = 'v';
                        break;
                    case 2:
                        params[ 'p' ] = power.find('[data-template="range"]');
                        params[ 'type' ] = 'h';
                        break;

                    case 3:
                        params[ 'p' ] = hull.find('[data-template="range"]');
                        params[ 'type' ] = 'h';
                        break;

                    case 4:
                        params[ 'p' ] = speed.find('[data-template="range"]');
                        params[ 'type' ] = 'h';
                        break;
                }

                setProgress( params );

                // var l = document.createElement('div');
                // l.classList.add( 'sw-status-progress-label' );
                // labelProgress( l, params );
                // progress[ i ][ 'l' ] = l;

                // c.appendChild( p );
                // b.appendChild( c );
                // b.appendChild( l );
                // a.appendChild( b );
            }

            return block;
        }

        /**
         *
         * @param {{key: (string|number), label: string, value: number, max: =number, reduction: =number, color: =string, unit: =string }} params
         * @returns {void}
         */
        function setProgress( params ) {

            var max = params.max == undefined ? 100 : params.max;
            var percent = params.value * 100 / max;

            switch ( params[ 'type' ] ) {
                case 'v':
                    $(params[ 'p' ]).css('height', ( percent > 100 ? 100 : percent ) + '%');
                    break;

                case 'h':
                    $(params[ 'p' ]).css('width', ( percent > 100 ? 100 : percent ) + '%');
                    break;
            }
        }

        // /**
        //  *
        //  * @param {Element} element
        //  * @param {{key: (string|number), label: string, number: number, max: =number, reduction: =number, color: =string, unit: =string }} params
        //  * @returns {void}
        //  */
        // function labelProgress( element, params ) {
        //     // var max = params.max == undefined ? 100 : params.max;
        //     // var unit = params.unit == undefined ? '%' : params.unit;
        //     // element.innerHTML = params.label + ': ' + max + ' / ' + params.number.toFixed( scope.fixing ) + ' ' + unit;
        // }

        this.reductionProgress = function ( key, speed ) {

            for ( var i = 0; i < progress.length; i++ ) {
                if ( progress[ i ][ 'key' ] === key ) {
                    progress[ i ][ 'reduction' ] = speed;
                    return this;
                }
            }

            console.warn( 'The progress was not found. Key: "' + key + '"' );

            return this
        };

        /**
         * This method will be do update of progress "speed" or "energy" oe, ... each time when spend 1 minute
         *
         * @returns {void}
         */
        function autoReduction() {

            setInterval(function () {
                if (!scope.enabled) {
                    return;
                }

                for ( var i = 0; i < progress.length; i++ ) {

                    var params = progress[ i ];

                    if ( params.reduction ) {

                        params.value += params.reduction;

                        if ( params.value >= params.max ) {

                            params.value = params.max;

                        } else if ( params.value <= params.min ) {

                            params.value = params.min;
                        }

                        setProgress( params );
                        // labelProgress(params['l'], params);

                        if (params.callback) {
                            params.callback.call( this, params, null );
                        }

                    }
                }

            }, scope.speedAutoUpdate);
        }

        /**
         *
         * @param {(string|number)} key
         * @param {number} value
         * @param {number} max
         * @returns {IW.PanelAction}
         */
        this.setProgress = function ( key, value, max ) {

            progress.push(
                {
                    key: key,
                    max: max,
                    value: value,
                    reduction: null
                }
            );
            return this;
        };

        /**
         *
         * @param {(string|number)} key
         * @param {number} value
         * @returns {IW.PanelAction}
         */
        this.updateProgress = function ( key, value ) {

            if (!scope.enabled) {
                return this;
            }

            var params = this.getProgress( key );

            if ( params ) {

                params.value = value;
                setProgress( params );
                // labelProgress( pr['l'], pr );
            }

            return this;
        };

        /**
         *
         * @param {(string|number|undefined)} key
         * @returns {*}
         */
        this.getProgress = function ( key ) {
            return progress.find(function ( item ) {
                return item.key === key;
            });
        };

        window.addEventListener( 'keydown', addKeyEvents, false);
        // window.addEventListener( 'resize', resize, false );

    };

    IW.PanelAction.ENERGY = 1;
    IW.PanelAction.ARMOR = 2;
    IW.PanelAction.HULL = 3;
    IW.PanelAction.SPEED = 4;
