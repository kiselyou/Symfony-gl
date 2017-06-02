    var IW = IW || {};
    /**
     *
     * @constructor
     */
    IW.PanelMap = function () {

        /**
         *
         * @type {null|Element}
         */
        var map = null;

        /**
         *
         * @returns {null|Element}
         */
        this.getMap = function () {
            return map;
        };

        /**
         *
         * @returns {IW.PanelMap}
         */
        this.show = function () {

            var loader = new IW.Templates();

            loader.load(
                '/panel/mini-map.html',
                function ( template ) {
                    $('body').append( templateMap( template ) );
                }
            );
            return this;
        };

        /**
         *
         * @param {string} template
         * @returns {Element}
         */
        function templateMap( template ) {

            var map = $(template);

            return map;
        }
    };
