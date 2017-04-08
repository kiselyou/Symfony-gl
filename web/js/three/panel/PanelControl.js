/**
 *
 * @param {THREE.MiniMap} miniMap
 * @param {string} [idPanel]
 * @constructor
 */
THREE.PanelControl = function ( miniMap, idPanel ) {

    /** @const {number} */
    var PANEL_MIN_WIDTH = 320;

    var PANEL_MAX_WIDTH = 1000;

    /** @const {number} */
    var INDENT_RIGHT = 10;

    /**
     *
     * @type {number}
     */
    this.speedAutoUpdate = 1000;

    /**
     *
     * @type {number}
     */
    this.fixing = 0;

    /**
     *
     * @type {string}
     */
    var id = idPanel == undefined ? 'sw-panel-control' : idPanel;

    /**
     *
     * @type {THREE.MiniMap}
     */
    var map = miniMap;

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
     * @type {THREE.PanelControl}
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
     * @param {Element} [element]
     * @returns {THREE.PanelControl}
     */
    this.appendTo = function ( element ) {

        var container = element ? element : document.body;
        container.appendChild( templatePanelControl() );
        return this;
    };

    /**
     *
     * @returns {Element}
     */
    function templatePanelAction() {

        var a = document.createElement('div');
        a.classList.add( 'sw-block-actions' );

        for ( var i = 0; i < actions.length; i++ ) {

            var action = actions[ i ];

            var b = document.createElement('div');
            b.classList.add( 'sw-action' );

            if ( action.active ) {
                b.setAttribute( 'data-active', 'sw-action-active' );
            }

            if ( action.icon != undefined ) {
                var c = document.createElement('div');
                c.classList.add('sw-action-icon');
                c.classList.add('glyphicon');
                c.classList.add('glyphicon-' + action.icon);
                b.appendChild( c );
            }

            if ( action.name != undefined ) {

                var d = document.createElement('div');
                d.classList.add('sw-action-keyword');
                d.innerHTML = action.name;
                b.appendChild(d);
            }

            a.appendChild( b );

            if ( action.keyCode != undefined ) {
                actions[ i ].element = b;
                keyEvents.push( action );
            }

            addEvent( b, action.callback );
        }

        return a;
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

        element.addEventListener( 'click', function ( e ) {

            if ( this.hasAttribute( 'data-active' ) ) {

                this.classList.toggle( this.getAttribute( 'data-active' ) );
            }

            callback.call( this, e );
        } );
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
    function templateProgress() {

        var a = document.createElement('div');
        a.classList.add( 'sw-block-progress' );

        for ( var i = 0; i < progress.length; i++ ) {

            /**
             *
             * @type {{key: (string|number), label: string, number: number, max: =number, auto: =number, color: =string, unit: =string }}
             */
            var params = progress[ i ];

            var b = document.createElement('div');
            b.classList.add( 'sw-row' );

            var c = document.createElement('div');
            c.classList.add( 'sw-status-progress' );

            var p = document.createElement('div');

            if ( params.color != undefined ) {
                p.style.background = params.color;
            }

            setProgress( p, params );
            progress[ i ][ 'p' ] = p;

            var l = document.createElement('div');
            l.classList.add( 'sw-status-progress-label' );
            labelProgress( l, params );
            progress[ i ][ 'l' ] = l;

            c.appendChild( p );
            b.appendChild( c );
            b.appendChild( l );
            a.appendChild( b );

            autoUpdate( progress[ i ] );
        }

        return a;
    }

    /**
     *
     * @param {{key: (string|number), label: string, number: number, max: =number, auto: =number, color: =string, unit: =string }} params
     * @returns {void}
     */
    function autoUpdate( params ) {

        if ( params.auto > 0 ) {

            params[ 'idInterval' ] = setInterval( function () {

                var max = params.max == undefined ? 100 : params.max;

                params.number += params.auto;

                if ( params.number >= max ) {
                    params.number = max;
                }

                setProgress( params['p'], params );
                labelProgress( params['l'], params );

            }, scope.speedAutoUpdate );
        }
    }

    /**
     *
     * @param {Element} element
     * @param {{key: (string|number), label: string, number: number, max: =number, auto: =number, color: =string, unit: =string }} params
     * @returns {void}
     */
    function setProgress( element, params ) {

        var max = params.max == undefined ? 100 : params.max;
        var percent = params.number * 100 / max;
        element.style.width = ( percent ) + '%';
    }

    /**
     *
     * @param {Element} element
     * @param {{key: (string|number), label: string, number: number, max: =number, auto: =number, color: =string, unit: =string }} params
     * @returns {void}
     */
    function labelProgress( element, params ) {
        var max = params.max == undefined ? 100 : params.max;
        var unit = params.unit == undefined ? '%' : params.unit;
        element.innerHTML = params.label + ': ' + max + ' / ' + params.number.toFixed( scope.fixing ) + ' ' + unit;
    }

    /**
     *
     * @param {(string|number)} key
     * @param {string} label
     * @param {?number} [max]
     * @param {?number} [auto]
     * @param {?string} [color]
     * @param {?string} [unit]
     * @returns {THREE.PanelControl}
     */
    this.addProgress = function ( key, label, max, auto, color, unit ) {
        progress.push(
            {
                key: key,
                label: label,
                number: 0,
                max: max,
                auto: auto,
                color: color,
                unit: unit
            }
        );
        return this;
    };

    /**
     *
     * @param {(string|number)} key
     * @param {number} number
     * @param {boolean} [increment]
     * @returns {THREE.PanelControl}
     */
    this.updateProgress = function ( key, number, increment ) {

        var pr = progress.find(function ( value ) {

            return value.key === key;
        });

        if ( pr != undefined ) {

            pr.number = increment ? pr.number + number : number;
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
    function templatePanelControl() {

        var size = getSize();
        panel = document.createElement('div');
        panel.id = id;
        panel.classList.add('sw-panel-control');
        panel.style.position = 'absolute';
        panel.style.width = size.width + 'px';

        panel.style.left = size.left + 'px';
        panel.style.bottom = size.bottom + 'px';
        panel.appendChild( templatePanelAction() );
        panel.appendChild( templateProgress() );

        return panel;
    }

    /**
     *
     * @returns {{width: Number, height: Number, left: number, top: number}}
     */
    function getSize() {

        var width = map ? map.getElement().offsetLeft : PANEL_MIN_WIDTH;
        width = width < PANEL_MIN_WIDTH ? PANEL_MIN_WIDTH : width;
        width = width > PANEL_MAX_WIDTH ? PANEL_MAX_WIDTH : width;

        return {
            width: width - INDENT_RIGHT,
            left: 0,
            bottom: 0
        }
    }

    /**
     *
     * @returns {void}
     */
    function resize() {

        if ( !panel ) {
            return;
        }

        var size = getSize();
        panel.style.left = size.left + 'px';
        panel.style.width = size.width + 'px';
        panel.style.bottom = size.bottom + 'px';
    }

    window.addEventListener( 'keydown', addKeyEvents, false);
    window.addEventListener( 'resize', resize, false );

};