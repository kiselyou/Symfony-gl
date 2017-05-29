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
        function templateProgressBar(string) {


            progressBar = document.createElement('div');
            progressBar.innerHTML = string;
            progressLine = progressBar.querySelector('[data-progress-range]');
            progressLabel = progressBar.querySelector('[data-progress-label]');

            if ( param.hideLabel ) {
                progressLabel.classList.add( 'iw_hidden' );
            }

            /*
            if ( param.width ) {
                progressBar.style.width = param.width;
            }
            */
            if ( param.position ) {
                var progressPosition = progressBar.querySelector('[data-progress-position]');
                progressPosition.classList.add( param.position );
            }

            if ( param.hide ) {
                progressBar.classList.add( 'iw_hidden' );
            }

            return progressBar;
        }

        /**
         *
         * @type {{position: ?string, width: null, hide: boolean, hideLabel: boolean}}
         */
        var param = {
            position: null,
            width: null,
            hide: false,
            hideLabel: false
        };

        /**
         *
         * @param {string} position
         * @returns {IW.ProgressBar}
         */
        this.setPosition = function ( position ) {
            param.position = position;
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

        var templates = [
            {
                name: IW.ProgressBar.TYPE_UPLOAD,
                path: '/progress/upload.html'
            }
        ];

        /**
         *
         * @param {string|number} [type] - it is type progress bar
         * @returns {IW.ProgressBar}
         */
        this.start = function (type) {

            var template = templates.find(function (value) {
                return value.name === type;
            });

            if (!template) {
                template = templates.find(function (value) {
                    return value.name === IW.ProgressBar.TYPE_DEFAULT;
                });
            }

            var tpl = new IW.Templates();

            tpl.load( template.path, function ( str ) {
                document.body.appendChild( templateProgressBar( str ) );
                moveProgress();
            } );

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

var prefix = 'iw_progress__position_';

IW.ProgressBar.POSITION_TOP = prefix + 'top';
IW.ProgressBar.POSITION_TOP_1 = prefix + 'top_1';
IW.ProgressBar.POSITION_TOP_2 = prefix + 'top_2';
IW.ProgressBar.POSITION_TOP_3 = prefix + 'top_3';
IW.ProgressBar.POSITION_TOP_4 = prefix + 'top_4';
IW.ProgressBar.POSITION_CENTER = prefix + 'center';
IW.ProgressBar.POSITION_BOTTOM = prefix + 'bottom';
IW.ProgressBar.POSITION_BOTTOM_1 = prefix + 'bottom_1';
IW.ProgressBar.POSITION_BOTTOM_2 = prefix + 'bottom_2';
IW.ProgressBar.POSITION_BOTTOM_3 = prefix + 'bottom_3';
IW.ProgressBar.POSITION_BOTTOM_4 = prefix + 'bottom_4';


IW.ProgressBar.TYPE_UPLOAD = 'upload';
IW.ProgressBar.TYPE_DEFAULT = IW.ProgressBar.TYPE_UPLOAD;
