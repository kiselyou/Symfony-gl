/**
 *
 * @param {Scene} scene
 * @constructor
 */
THREE.ModelsLoader = function ( scene ) {

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
     * @param {{name: string, path: string, object: Mesh}} uploaded
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
     * @type {THREE.ModelsLoader}
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
     * @param {string} name,
     * @param {string} path
     * @returns {THREE.ModelsLoader}
     */
    this.addLoad = function ( name, path ) {

        this.upload.push( {
            name: name,
            path: path,
            object: null
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

    /**
     * Callback for adding action when all models has loaded
     *
     * @param {doneLoadCallback} callback
     */
    this.load = function ( callback ) {
        doneLoad = callback;
        lengthUpload = 100 / this.upload.length;
        loadModel( new THREE.OBJLoader( new THREE.LoadingManager() ) );
    };

    /**
     *
     * @param {THREE.OBJLoader} loader
     * @returns {void}
     */
    function loadModel( loader ) {

        var upload = scope.upload[ 0 ];

        if ( upload == undefined ) {

            if ( doneLoad ) {

                progressBar.doneCallback( doneLoad );
            }

            return;
        }

        scope.upload.splice(0, 1);

        var previousProgress = 0;

        loader.load(
            upload.path,
            function ( object ) {

                upload[ 'object' ] = object;
                models.push( upload );

                if ( scope.objectLoaded ) {

                    scope.objectLoaded.call( this, upload );
                }

                loadModel( loader );

            },
            function ( pr ) {

                var loaded = pr.loaded / pr.total * lengthUpload;
                loadingPercent += loaded - previousProgress;
                progressBar.update( loadingPercent, upload );
                previousProgress = loaded;

            },
            function ( er ) {
                console.log( er );
            }
        );
    }

};