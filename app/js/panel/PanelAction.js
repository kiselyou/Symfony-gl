    var IW = IW || {};

    /**
     *
     * @param {string} [htmlId]
     * @constructor
     */
    IW.PanelAction = function ( htmlId ) {

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
         * @type {number}
         */
        this.fixing = 0;

        /**
         *
         * @type {string}
         */
        var id = htmlId ? 'sw-panel-control' : htmlId;

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
         * @param {boolean} [active]
         */
        this.addAction = function ( callback, name, icon, keyCode, active ) {

            actions.push(
                {
                    callback: callback,
                    active: active,
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
        this.appendActionsTo = function () {

            var loader = new IW.Templates();

            loader.load(
                '/panel/model-progress.html',
                function ( template ) {
                    // loader.paste( 'body', template, false );
                    $('body').append( templateProgress( template ) );
                }
            );

            loader.load(
                '/panel/controls.html',
                function ( template ) {
                    // loader.paste( 'body', template, false );

                    $('body').append( templatePanelAction( template ) );
                }
            );

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

                if ( action.active ) {
                    // b.setAttribute( 'data-active', 'sw-action-active' );
                }

                // if ( action.icon != undefined ) {
                //     var c = document.createElement('div');
                //     c.classList.add('sw-action-icon');
                //     c.classList.add('glyphicon');
                //     c.classList.add('glyphicon-' + action.icon);
                //     b.appendChild( c );
                // }

                if ( action.name ) {

                    var keyElement = b.find( '[data-template="element-keyword"]' );
                    keyElement.text( action.name );
                }

                block.append( b );

                if ( action.keyCode ) {
                    actions[ i ].element = b;
                    keyEvents.push( action );
                }

                addEvent( b, action.callback );
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
                    keyEvents[ i ][ 'callback' ].call( this, e, keyEvents[ i ][ 'element' ] );
                }
            }
        }

        /**
         *
         * @param {Element} element
         * @param callback
         */
        function addEvent( element, callback ) {

            $(element).on('click', function ( e ) {

                // if ( this.hasAttribute( 'data-active' ) ) {
                //
                //     this.classList.toggle( this.getAttribute( 'data-active' ) );
                // }

                callback.call( this, e );
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
                 * @type {{key: (string|number), label: string, number: number, max: =number, reduction: =number, color: =string, unit: =string }}
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
                //
                // autoUpdate( progress[ i ] );
            }

            return block;
        }

        /**
         *
         * @param {{key: (string|number), label: string, number: number, max: =number, reduction: =number, color: =string, unit: =string }} params
         * @returns {void}
         */
        function autoUpdate( params ) {

            // if ( params.reduction > 0 ) {
            //
            //     params[ 'idInterval' ] = setInterval( function () {
            //
            //         var max = params.max == undefined ? 100 : params.max;
            //
            //         params.number += params.reduction;
            //
            //         if ( params.number >= max ) {
            //             params.number = max;
            //         }
            //
            //         setProgress( params['p'], params );
            //         labelProgress( params['l'], params );
            //
            //         if ( params.callback != undefined ) {
            //             params.callback.call( this, params );
            //         }
            //
            //
            //     }, scope.speedAutoUpdate );
            // }
        }

        /**
         *
         * @param {{key: (string|number), label: string, number: number, max: =number, reduction: =number, color: =string, unit: =string }} params
         * @returns {void}
         */
        function setProgress( params ) {

            var max = params.max == undefined ? 100 : params.max;
            var percent = params.number * 100 / max;

            switch ( params[ 'type' ] ) {
                case 'v':
                    $(params[ 'p' ]).css('height', ( percent > 100 ? 100 : percent ) + '%');
                    break;

                case 'h':
                    $(params[ 'p' ]).css('width', ( percent > 100 ? 100 : percent ) + '%');
                    break;
            }
        }

        /**
         *
         * @param {Element} element
         * @param {{key: (string|number), label: string, number: number, max: =number, reduction: =number, color: =string, unit: =string }} params
         * @returns {void}
         */
        function labelProgress( element, params ) {
            // var max = params.max == undefined ? 100 : params.max;
            // var unit = params.unit == undefined ? '%' : params.unit;
            // element.innerHTML = params.label + ': ' + max + ' / ' + params.number.toFixed( scope.fixing ) + ' ' + unit;
        }

        /**
         *
         * @param {(string|number)} key
         * @param {string} label
         * @param {?number} [max]
         * @param {?number} [reduction]
         * @param {?string} [color]
         * @param {?string} [callback]
         * @param {?string} [unit]
         * @returns {IW.PanelAction}
         */
        this.addProgress = function ( key, label, max, reduction, color, callback, unit ) {

            progress.push(
                {
                    key: key,
                    label: label,
                    number: 0,
                    max: max,
                    reduction: reduction,
                    color: color,
                    unit: unit,
                    callback: callback
                }
            );
            return this;
        };

        /**
         *
         * @param {(string|number)} key
         * @param callback
         * @returns {IW.PanelAction}
         */
        this.addCallback = function ( key, callback ) {

            var pr = progress.find(function ( value ) {

                return value.key === key;
            });

            if ( pr != undefined ) {
                pr.callback = callback;
            }

            return this;
        };

        /**
         *
         * @param {(string|number)} key
         * @param {number} number
         * @param {boolean} [increment]
         * @returns {IW.PanelAction}
         */
        this.updateProgress = function ( key, number, increment ) {

            var pr = progress.find(function ( value ) {

                return value.key === key;
            });

            if ( pr != undefined ) {

                pr.number = increment ? pr.number + number : number;
                setProgress( pr );
                // labelProgress( pr['l'], pr );
            }

            return this;
        };

        /**
         *
         * @param {(string|number)} key
         * @returns {*}
         */
        this.getProgress = function ( key ) {
            return progress.find(function ( value ) {
                return value.key === key;
            });
        };

        /**
         *
         * @returns {Element}
         */
        function templatePanel() {

            // var size = getSize();
            // panel = document.createElement('div');
            // panel.id = id;
            // panel.classList.add('sw-panel-control');
            // panel.classList.add('sw-modal-skin-panel');
            // panel.style.position = 'absolute';
            //
            // panel.style.left = size.left + 'px';
            // panel.style.bottom = size.bottom + 'px';
            // panel.appendChild( templatePanelAction() );
            // panel.appendChild( templateProgress() );


            return panel;
        }

        // /**
        //  *
        //  * @returns {{height: Number, left: number, top: number}}
        //  */
        // function getSize() {
        //
        //     return {
        //         left: 0,
        //         bottom: 0
        //     }
        // }

        // /**
        //  *
        //  * @returns {void}
        //  */
        // function resize() {
        //
        //     if ( !panel ) {
        //         return;
        //     }
        //
        //     var size = getSize();
        //     panel.style.left = size.left + 'px';
        //     panel.style.bottom = size.bottom + 'px';
        // }

        window.addEventListener( 'keydown', addKeyEvents, false);
        // window.addEventListener( 'resize', resize, false );

    };
