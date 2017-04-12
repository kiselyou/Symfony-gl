    var IW = IW || {};

    /**
     *
     * @param {Scene} scene
     * @constructor
     */
    IW.MultiLoader = function ( scene ) {

        /**
         *
         * @type {Array}
         */
        this.upload = [];

        /**
         *
         * @type {string}
         */
        this.basedir = '';

        /**
         *
         * @type {Scene}
         */
        this.scene = scene;

        /**
         * Callback for adding action when model has loaded
         *
         * @param {{ name: string, pathOBJ: string, object: ?Mesh, pathMTL: string, directory: string }} uploaded
         * @callback objectLoadedCallback
         */

        /**
         * @type {(objectLoadedCallback|null)}
         */
        var _objectLoadedCallback = null;

        /**
         * Callback for adding action when all models has loaded
         *
         * @callback doneLoadCallback
         */

        /**
         * @type {(doneLoadCallback|null)}
         */
        var doneLoad = null;

        /**
         *
         * @type {IW.MultiLoader}
         */
        var scope = this;

        /**
         *
         * @type {Array}
         */
        var models = [];

        /**
         * When object loaded to do something
         *
         * @param {objectLoadedCallback} callback
         * @returns {IW.MultiLoader}
         */
        this.setLoadedCallback = function ( callback  ) {
            _objectLoadedCallback = callback;
            return this;
        };

        /**
         * Get loaded object - CLONE
         *
         * @param {string} name
         * @returns {?Mesh}
         */
        this.getModel = function ( name ) {

            var model = models.find(function( value ) {
                return value.name == name;
            });

            return model ? model.object.clone() : null;
        };

        /**
         * Get loaded models - ORIGINAL
         *
         * @returns {Array}
         */
        this.getModels = function () {
            return models;
        };

        /**
         * Add data for model upload
         *
         * @param {string} name
         * @param {string} directory
         * @param {string} pathOBJ
         * @param {string} [pathMTL]
         * @returns {IW.MultiLoader}
         */
        this.addLoad = function ( name, directory, pathOBJ, pathMTL ) {

            this.upload.push( {
                object: null,
                name: name,
                pathOBJ: pathOBJ,
                pathMTL: pathMTL,
                directory: directory
            } );

            return this;
        };

        /**
         *
         * @type {IW.ProgressBar}
         */
        var progressBar = new IW.ProgressBar();

        /**
         *
         * @type {THREE.LoadingManager}
         */
        var manager = new THREE.LoadingManager();

        /**
         *
         * @type {THREE.OBJLoader}
         */
        var objLoader = new THREE.OBJLoader( manager );

        /**
         *
         * @type {THREE.MTLLoader}
         */
        var mtlLoader = new THREE.MTLLoader( manager );

        /**
         *
         * @param {string} [position] possible values
         * @param {number} [int]
         * @returns {IW.MultiLoader}
         */
        this.setPositionProgress = function ( position, int ) {

            progressBar.setPosition( position, int );
            return this;
        };

        /**
         *
         * @param {string} [width]
         * @returns {IW.MultiLoader}
         */
        this.setWithProgress = function ( width ) {
            progressBar.setWidth( width );
            return this;
        };

        /**
         *
         * @returns {IW.MultiLoader}
         */
        this.hideProgress = function () {
            progressBar.hide();
            return this;
        };

        /**
         *
         * @returns {IW.MultiLoader}
         */
        this.hideLabelProgress = function () {
            progressBar.hideLabel();
            return this;
        };

        /**
         * Callback for adding action when all models has loaded
         *
         * @param {doneLoadCallback} callback
         */
        this.load = function ( callback ) {

            doneLoad = callback;
            progressBar.open();
            progressBar.setCount( this.upload.length * 2 );
            loadModels();
        };

        /**
         * Start upload models
         *
         * @returns {void}
         */
        function loadModels() {

            var params = scope.upload[ 0 ];

            if ( params == undefined ) {

                if ( doneLoad ) {

                    progressBar.doneCallback( doneLoad );
                }

                return;
            }

            scope.upload.splice(0, 1);

            if ( params.pathMTL != undefined ) {

                loadMaterial( params );

            } else {

                loadObject( params );
            }
        }

        /**
         * Start upload object ( model )
         *
         * @param {{ name: string, pathOBJ: string, object: ?Mesh, pathMTL: string, directory: string }} params
         * @returns {void}
         */
        function loadObject( params ) {

            progressBar.setLabel( params.name );

            objLoader.setPath( params.directory );

            objLoader.load(
                params.pathOBJ,
                function ( object ) {

                    var geometry = new THREE.SphereGeometry( 5, 10, 10 );
                    var material = new THREE.MeshLambertMaterial( { color: 0x4AB5E2, opacity: 0, transparent: true } );
                    var sphere = new THREE.Mesh( geometry, material );
                    sphere.add( object );

                    params[ 'object' ] = sphere;
                    models.push( params );

                    if ( _objectLoadedCallback ) {
                        _objectLoadedCallback.call( this, params );
                    }

                    loadModels();

                },
                progressBar.onProgress,
                progressBar.onError
            );
        }

        /**
         * Load textures for object
         *
         * @param {{ name: string, pathOBJ: string, object: ?Mesh, pathMTL: string, directory: string }} params
         */
        function loadMaterial( params ) {

            progressBar.setLabel( params.name );
            mtlLoader.setTexturePath( params.directory );
            mtlLoader.setPath( params.directory );

            mtlLoader.load(
                params.pathMTL,
                function( materials ) {

                    materials.preload();
                    objLoader.setMaterials( materials );

                    loadObject( params );

                },
                progressBar.onProgress,
                progressBar.onError
            );
        }
    };