var ui = {};

(function(ui) {

    'use strict';

    /**
     *
     * @memberOf ui
     * @namespace ui.ProgressBar
     * @constructor
     */
    ui.ProgressBar = function() {

        /**
         *
         * @type {string}
         */
        this.unit = '%';

        /**
         *
         * @type {boolean}
         */
        this.autoClose = true;

        /**
         *
         * @type {number}
         */
        this.speedProgres = 0.5;

        /**
         *
         * @type {(null|Element)}
         */
        var progressBar = null;

        /**
         *
         * @type {(null|Element)}
         */
        var progressLine = null;

        /**
         *
         * @type {(null|Element)}
         */
        var progressLabel = null;

        /**
         *
         * @type {ui.ProgressBar}
         */
        var scope = this;

        /**
         * Build template progress bar
         *
         * @returns {Element}
         */
        function templateProgressBar() {

            progressBar = document.createElement('div');
            progressBar.classList.add( 'progress-block' );

            var bar = document.createElement('div');
            bar.classList.add( 'progress-galaxy' );

            bar.classList.add('progress-striped');
            bar.classList.add('active');

            progressLine = document.createElement('div');
            progressLine.classList.add( 'progress-bar-galaxy' );

            progressLabel = document.createElement('div');
            progressLabel.classList.add( 'progress-bar-label' );

            bar.appendChild( progressLine );
            progressBar.appendChild( bar );
            progressBar.appendChild( progressLabel );

            return progressBar;
        }

        /**
         *
         * @returns {ui.ProgressBar}
         */
        this.open = function () {

            document.body.appendChild( templateProgressBar() );
            return this;
        };

        /**
         *
         * @type {number}
         */
        var loaded = 0;

        /**
         *
         * @type {null|number}
         */
        var idInterval = null;

        /**
         *
         * @param {number} load
         * @param {string} [label]
         * @returns {ui.ProgressBar}
         */
        this.update = function ( load, label ) {

            if ( !progressBar ) {
                this.open();
            }

            if ( idInterval ) {
                clearInterval( idInterval );
            }

            label = label == undefined ? '' : ': ' + label;

            idInterval = setInterval(function() {

                loaded += scope.speedProgres;
                progressLine.style.width = loaded + '%';
                progressLabel.innerHTML = loaded.toFixed( 0 ) + scope.unit + label;

                if ( loaded >= 100 || loaded >= load ) {
                    clearInterval( idInterval );
                }

                if ( loaded >= 100 ) {
                    scope.close();
                }

            }, 10);

            return this;
        };

        /**
         *
         * @returns {ui.ProgressBar}
         */
        this.close = function () {

            if (progressBar) {
                setTimeout(function () {
                    progressBar.remove();
                }, 500);
            }
            return this;
        };
    }

} (window.ui || {}));