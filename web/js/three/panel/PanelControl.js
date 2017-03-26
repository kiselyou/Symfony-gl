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

    var keyEvents = [];

    function addKeyEvents( e ) {

        for ( var i = 0; i < keyEvents.length; i++ ) {

            if ( e.keyCode == keyEvents[ i ][ 'keyCode' ] ) {

                keyEvents[ i ][ 'callback' ].call( this, e, keyEvents[ i ][ 'element' ] );
            }
        }
    }

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
     * @returns {Element}
     */
    function templatePanelControl() {

        var size = getSize();
        panel = document.createElement('div');
        panel.id = id;
        panel.classList.add('sw-panel-control');
        panel.style.position = 'absolute';
        panel.style.width = size.width + 'px';

        panel.width = size.width;

        panel.style.left = size.left + 'px';
        panel.style.bottom = size.bottom + 'px';
        panel.appendChild( templatePanelAction() );

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
        // panel.style.top = size.top + 'px';
        panel.style.width = size.width + 'px';
        // panel.style.height = size.height + 'px';
    }

    window.addEventListener( 'keydown', addKeyEvents, false);
    window.addEventListener( 'resize', resize, false );

};