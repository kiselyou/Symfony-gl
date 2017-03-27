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
    this.path = [];

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
     * @callback objectLoaded
     */

    /**
     * @type {(objectLoaded|null)}
     */
    this.objectLoaded = null;

    /**
     * Callback for adding action when all models has loaded
     *
     * @callback doneLoad
     */

    /**
     * @type {(doneLoad|null)}
     */
    this.doneLoad = null;

    /**
     *
     * @type {THREE.ModelsLoader}
     */
    var scope = this;

    /**
     *
     * @param {string} url
     * @returns {THREE.ModelsLoader}
     */
    this.addPath = function ( url ) {

        this.path.push( url );

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
     * @param {doneLoad} doneLoad
     */
    this.load = function ( doneLoad ) {
        this.doneLoad = doneLoad;
        lengthUpload = 100 / this.path.length;
        loadModel( new THREE.OBJLoader( new THREE.LoadingManager() ) );
    };

    /**
     *
     * @param {THREE.OBJLoader} loader
     * @returns {void}
     */
    function loadModel( loader ) {

        var path = scope.path[ 0 ];

        if ( path == undefined ) {

            if ( scope.doneLoad ) {

                progressBar.doneCallback( scope.doneLoad );
            }

            return;
        }

        scope.path.splice(0, 1);

        var previousProgress = 0;

        loader.load(
            path,
            function ( object ) {

            if ( scope.objectLoaded ) {

                scope.objectLoaded.call( this, object, path );
            }

            scope.scene.add( object );

            loadModel( loader );

            },
            function ( pr ) {

                var loaded = pr.loaded / pr.total * lengthUpload;
                loadingPercent += loaded - previousProgress;
                progressBar.update( loadingPercent, path );
                previousProgress = loaded;

            },
            function ( er ) {
                console.log( er );
            }
        );
    }

};