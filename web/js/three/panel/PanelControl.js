
THREE.PanelControl = function ( idPanel ) {

    /** @const {number} */
    var PANEL_WIDTH = 290;

    /** @const {number} */
    var PANEL_HEIGHT = 80;

    /**
     *
     * @type {string}
     */
    var id = idPanel == undefined ? 'sw-panel-control' : idPanel;

    var actions = [];

    /**
     *
     * @type {null|Element}
     */
    var panel = null;

    this.addAction = function ( name, icon, callback ) {
        actions.push(
            {
                name: name,
                icon: icon,
                callback: callback
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

            var c = document.createElement('div');
            c.classList.add( 'sw-action-keyword' );

            b.appendChild( c );
            a.appendChild( b );

            addEvent( b, action.callback );
        }

        return a;
    }

    function addEvent( element, callback ) {

        element.addEventListener( 'click', function ( e ) {
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
        panel.style.height = size.height + 'px';
        panel.style.left = size.left + 'px';
        panel.style.top = size.top + 'px';
        panel.appendChild( templatePanelAction() );
        return panel;
    }

    /**
     *
     * @returns {{width: Number, height: Number, left: number, top: number}}
     */
    function getSize() {

        return {
            width: PANEL_WIDTH,
            height: PANEL_HEIGHT,
            left: 0,
            top: window.innerHeight - PANEL_HEIGHT
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
        panel.style.top = size.top + 'px';
    }

    window.addEventListener( 'resize', resize, false );

};