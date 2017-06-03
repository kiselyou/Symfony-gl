    var IW = IW || {};
    /**
     *
     * @constructor
     */
    IW.PanelMap = function () {

        /**
         * The template of map
         *
         * @type {?jQuery}
         */
        var map = null;

        /**
         * The template of menu
         *
         * @type {?jQuery}
         */
        var menu = null;

        /**
         * This method is including templates and preparing them and append to the dom tree
         *
         * @returns {IW.PanelMap}
         */
        this.show = function () {

            var loader = new IW.Templates();

            loader.load(
                '/panel/mini-map.html',
                function ( template ) {
                    $('body').append( prepareTemplateMap( template ) );
                }
            );

            loader.load(
                '/nav/play-menu.html',
                function ( template ) {
                    $('body').append( prepareTemplateMenu( template ) );
                }
            );

            return this;
        };

        /**
         * Prepare template of menu before append to dom tree
         *
         * @param {string} template
         * @returns {?jQuery}
         */
        function prepareTemplateMenu( template ) {
            menu = $(template);
            switchMenu( menu, 'action-close-menu' );
            return menu;
        }

        /**
         * Prepare template of map before append to dom tree
         *
         * @param {string} template
         * @returns {jQuery}
         */
        function prepareTemplateMap( template ) {

            map = $(template);
            var fullScreen = findAction( map, 'action-fullscreen' );

            fullScreen.click( function ( e ) {
                new IW.FullScreen().toggle();
            } );

            switchMenu( map, 'action-show-or-hide-menu' );

            return map;
        }

        /**
         * Find action in the element
         *
         * @param {jQuery} element - It is element where need find action
         * @param {string} actionName - name of action
         * @returns {jQuery}
         */
        function findAction( element, actionName ) {
            return element.find('[data-action="' + actionName + '"]');
        }

        /**
         * This method add event to element which has specific name of action and show or hide menu
         *
         * @param {jQuery} element - It is element where need find action
         * @param {string} actionName - name of action
         * @returns {void}
         */
        function switchMenu( element, actionName ) {
            var showMenu = findAction( element, actionName );
            showMenu.click( function ( e ) {
                menu.removeClass('iw_hidden');
                menu.toggleClass( 'iw_show_a', 'iw_hide_a' );
            } );
        }
    };
