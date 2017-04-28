var IW = IW || {};

(function(IW) {

    'use strict';

    /**
     *
     * @memberOf IW
     * @namespace IW.ProgressBar
     * @constructor
     */
    IW.ProgressBar = function() {

        /**
         *
         * @type {null|function}
         * @private
         */
        this._callback = null;

        /**
         * Callback for adding action when progress has completed
         *
         * @callback done
         */

        /**
         *
         * @param {done} callback - Callback for adding action when progress has completed
         * @returns {IW.ProgressBar}
         */
        this.doneCallback = function ( callback ) {
            this._callback = callback;
            return this;
        };

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
         * @type {IW.ProgressBar}
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

            if ( param.hideLabel ) {
                progressLabel.setAttribute('hidden', 'hidden');
            }

            bar.appendChild( progressLine );
            progressBar.appendChild( bar );
            progressBar.appendChild( progressLabel );

            if ( param.width ) {
                progressBar.style.width = param.width;
            }

            if ( param.position ) {
                progressBar.style.top = param.position;
            }

            if ( param.hide ) {
                progressBar.setAttribute('hidden', 'hidden');
            }

            return progressBar;
        }

        var param = {
            position: null,
            width: null,
            hide: false,
            hideLabel: false
        };

        /**
         *
         * @param {string} position
         * @param {number} int
         * @returns {IW.ProgressBar}
         */
        this.setPosition = function ( position, int ) {
            if ( position == undefined ) {
                return this;
            }

            int = int != undefined ? int : 0;

            switch ( position ) {
                case IW.ProgressBar.POSITION_T:
                    param.position = int + 'px';
                    break;
                case IW.ProgressBar.POSITION_B:
                    param.position = ( window.innerHeight - 60 - int ) + 'px';
                    break;
                case IW.ProgressBar.POSITION_C:
                    param.position = ( window.innerHeight / 2 + int ) + 'px';
                    break;
            }

            return this;

        };

        /**
         *
         * @param {number} width
         * @returns {IW.ProgressBar}
         */
        this.setWidth = function ( width ) {
            param.width = width != undefined ? width : null;
            return this;
        };

        /**
         *
         * @returns {IW.ProgressBar}
         */
        this.hide = function () {
            param.hide = true;
            return this;
        };

        /**
         *
         * @returns {IW.ProgressBar}
         */
        this.hideLabel = function () {
            param.hideLabel = true;
            return this;
        };

        /**
         *
         * @returns {IW.ProgressBar}
         */
        this.open = function () {

            document.body.appendChild( templateProgressBar() );
            moveProgress();
            return this;
        };

        /**
         *
         * @type {number}
         */
        var loaded = 0;

        /**
         *
         * @type {Array}
         */
        var queue = [];

        /**
         *
         * @param {number} status
         * @param {?string} [label]
         * @returns {IW.ProgressBar}
         */
        this.update = function ( status, label ) {

            queue.push(
                {
                    label: label,
                    progress: Math.ceil( status )
                }
            );

            return this;
        };

        /**
         * @returns {void}
         */
        function moveProgress() {

            var idInterval = setInterval(function() {

                var status = queue[ 0 ];
                if ( status && ( loaded <= status.progress + scope.speedProgres ) ) {

                    loaded += scope.speedProgres;
                    progressLine.style.width = loaded + '%';
                    progressLabel.innerHTML = loaded.toFixed( 0 ) + scope.unit + ' ' + status.label;

                    if ( loaded >= status.progress  ) {
                        queue.splice( 0, 1 );
                        loaded -= scope.speedProgres;
                    }
                }

                if ( loaded + scope.speedProgres >= 100 ) {
                    clearInterval( idInterval );
                    scope.close();
                    loaded = 0;
                }

            }, 5);
        }

        /**
         *
         * @returns {IW.ProgressBar}
         */
        this.close = function () {

            if ( progressBar ) {
                setTimeout(function () {
                    progressBar.remove();

                    if ( scope._callback ) {
                        scope._callback.call( this );
                    }

                }, 200);
            }
            return this;
        };

        /**
         *
         * @type {{label: ?string, count: number, previousProgress: number, progress: number}}
         */
        var control = {
            label: null,
            count: 0,
            previousProgress: 0,
            progress: 0
        };

        /**
         *
         * @param {number} count
         * @returns {void}
         */
        this.setCountUpload = function( count ) {
            control.count = 100 / ( count );
        };

        /**
         *
         * @param {?string} label
         * @returns {void}
         */
        this.setLabel = function ( label ) {
            control.previousProgress = 0;
            control.label = label;
        };

        /**
         *
         * @param {*} progress
         */
        this.onProgress = function ( progress ) {

            var loaded = progress.loaded / progress.total * control.count;
            control.progress += loaded - control.previousProgress;
            scope.update( control.progress, control.label );
            control.previousProgress = loaded;

        };

        /**
         *
         * @param {*} error
         */
        this.onError = function ( error ) {

            scope.close();
            // IW.Alert
            console.log( error );
        }
    }

} (window.IW || {}));

IW.ProgressBar.POSITION_T = 'top';
IW.ProgressBar.POSITION_C = 'center';
IW.ProgressBar.POSITION_B = 'bottom';