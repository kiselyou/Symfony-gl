
(function(ui) {

    'use strict';

    /**
     * @param {Element} [element]
     * @memberOf ui
     * @namespace ui.FullScreen
     * @constructor
     */
    ui.FullScreen = function( element ) {

        var container = element ? element : document.body;

        /**
         * Open element full screen
         *
         * @returns {boolean}
         */
        this.open = function () {

            if ( container.requestFullScreen ) {

                container.requestFullScreen();
                return true;

            } else if ( container.mozRequestFullScreen ) {

                container.mozRequestFullScreen();
                return true;

            } else if ( container.webkitRequestFullScreen ) {

                container.webkitRequestFullScreen();
                return true;
            }

            return false;
        };

        /**
         * Open new window full screen
         *
         * @param url
         */
        this.windowOpen = function ( url ) {
            window.open( url, '', 'height=' + screen.height + ',width=' + screen.width + ',screenX=0,screenY=0,left=0,top=0,resizable=no' );
        };

        /**
         * Close element full screen
         *
         * @returns {boolean}
         */
        this.cancel = function () {

            if ( document.cancelFullScreen ) {

                document.cancelFullScreen();
                return true;

            } else if ( document.mozCancelFullScreen ) {

                document.mozCancelFullScreen();
                return true;

            } else if ( document.webkitCancelFullScreen ) {

                document.webkitCancelFullScreen();
                return true;
            }

            return false;
        };

        /**
         *
         * @returns {*}
         */
        this.toggle = function () {

            if ( this.isOpened() ) {

                return {
                    action: 'close',
                    status: this.cancel()
                };

            } else {

                return {
                    action: 'open',
                    status: this.open()
                };

            }
        };

        this.isOpened = function () {

            return !(
                !document.fullscreenElement &&
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement
            );
        };
    }

} (window.ui || {}));