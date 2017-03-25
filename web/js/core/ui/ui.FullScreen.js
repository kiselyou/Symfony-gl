
(function(ui) {

    'use strict';

    /**
     *
     * @memberOf ui
     * @namespace ui.FullScreen
     * @constructor
     */
    ui.FullScreen = function() {

        /**
         * Open element full screen
         *
         * @param {Element} element
         * @returns {boolean}
         */
        this.open = function ( element ) {

            if ( element.requestFullScreen ) {

                element.requestFullScreen();
                return true;

            } else if ( element.mozRequestFullScreen ) {

                element.mozRequestFullScreen();
                return true;

            } else if ( element.webkitRequestFullScreen ) {

                element.webkitRequestFullScreen();
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
         * @param {Element} element
         * @returns {boolean}
         */
        this.cancel = function ( element ) {

            if ( element.cancelFullScreen ) {

                element.cancelFullScreen();
                return true;

            } else if ( element.mozCancelFullScreen ) {

                element.mozCancelFullScreen();
                return true;

            } else if ( element.webkitCancelFullScreen ) {

                element.webkitCancelFullScreen();
                return true;
            }

            return false;
        };

        /**
         *
         * @param {Element} element
         * @returns {*}
         */
        this.toggle = function ( element ) {

            if (!element.fullscreenElement &&
                !element.mozFullScreenElement &&
                !element.webkitFullscreenElement
            ) {

                return {
                    action: 'open',
                    status: this.open( element )
                };

            } else {

                return {
                    action: 'close',
                    status: this.cancel( element )
                };
            }
        }
    }

} (window.ui || {}));