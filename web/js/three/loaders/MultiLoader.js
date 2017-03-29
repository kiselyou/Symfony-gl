/**
 *
 * @param {Scene} scene
 * @constructor
 */
THREE.MultiLoader = function ( scene ) {

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
    this.objectLoaded = null;

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
     * @type {THREE.MultiLoader}
     */
    var scope = this;

    /**
     *
     * @type {Array}
     */
    var models = [];

    /**
     *
     * @param {string} name
     * @returns {null|Mesh}
     */
    this.getModel = function ( name ) {

        var model = models.find(function( value ) {
            return value.name == name;
        });

        return model ? model.object.clone() : null;
    };

    /**
     *
     * @returns {Array}
     */
    this.getModels = function () {
        return models;
    };

    /**
     * @param {string} name
     * @param {string} directory
     * @param {string} pathOBJ
     * @param {string} [pathMTL]
     * @returns {THREE.MultiLoader}
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
     * @type {number}
     */
    var lengthUpload = 0;

    /**
     *
     * @type {number}
     */
    var loadingPercent = 0;

    /**
     *
     * @type {ui.ProgressBar}
     */
    var progressBar = new ui.ProgressBar();

    var manager = new THREE.LoadingManager();
    var objLoader = new THREE.OBJLoader( manager );
    var mtlLoader = new THREE.MTLLoader( manager );

    /**
     * Callback for adding action when all models has loaded
     *
     * @param {doneLoadCallback} callback
     */
    this.load = function ( callback ) {

        doneLoad = callback;
        lengthUpload = 100 / this.upload.length;
        loadModels( callback );
    };

    /**
     *
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
     *
     * @param {{ name: string, pathOBJ: string, object: ?Mesh, pathMTL: string, directory: string }} params
     * @returns {void}
     */
    function loadObject( params ) {

        loadInfo.setLabel( params.name );

        objLoader.setPath( params.directory );

        objLoader.load(
            params.pathOBJ,
            function ( object ) {

                params[ 'object' ] = object;
                models.push( params );

                if ( scope.objectLoaded ) {

                    scope.objectLoaded.call( this, params );
                }

                loadModels();

            },
            loadInfo.onProgress,
            loadInfo.onError
        );
    }

    /**
     *
     * @param {{ name: string, pathOBJ: string, object: ?Mesh, pathMTL: string, directory: string }} params
     */
    function loadMaterial( params ) {

        loadInfo.setLabel( params.name );

        mtlLoader.setTexturePath( params.directory );
        mtlLoader.setPath( params.directory );

        mtlLoader.load(
            params.pathMTL,
            function( materials ) {

                materials.preload();
                objLoader.setMaterials( materials );

                loadObject( params );

            },
            loadInfo.onProgress,
            loadInfo.onError
        );
    }

    /**
     *
     * @type {{label: ?string, value: number, setLabel: loadInfo.setLabel, onProgress: loadInfo.onProgress, onError: loadInfo.onError}}
     */
    var loadInfo = {
        label: null,
        value: 0,

        /**
         *
         * @param {?string} label
         */
        setLabel: function ( label ) {
            this.value = 0;
            this.label = label;
        },

        /**
         *
         * @param {*} progress
         */
        onProgress: function ( progress ) {

            var loaded = progress.loaded / progress.total * lengthUpload;
            loadingPercent += loaded - loadInfo.value;
            progressBar.update( loadingPercent, this.label );
            this.value = loaded;
        },

        /**
         *
         * @param {*} error
         */
        onError: function ( error ) {
            console.log( error );
        }
    };
};