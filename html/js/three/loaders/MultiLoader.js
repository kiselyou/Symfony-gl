var IW = IW || {};

/**
 *
 * @constructor
 */
IW.MultiLoader = function () {

    /**
     *
     * @type {Array}
     */
    this.upload = [];

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
     * Callback for adding action when load is completed
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
    var _objects = [];

    /**
     *
     * @type {Array}
     */
    var _textures = [];

    /**
     *
     * @type {Array}
     */
    var _files = [];

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
    this.getObject = function ( name ) {

        var object = _objects.find(function( value ) {
            return value.name == name;
        });

        return object ? object.object.clone() : null;
    };

    /**
     * Get loaded object - ORIGINAL
     *
     * @returns {Array}
     */
    this.getObjects = function () {

        return _objects;
    };

    /**
     * Get loaded texture - ORIGINAL
     *
     * @param {string} name
     * @returns {?THREE.Texture}
     */
    this.getTexture = function ( name ) {

        var texture = _textures.find(function( value ) {
            return value.name == name;
        });

        return texture ? texture.texture : null;
    };

    /**
     * Get loaded textures - ORIGINAL
     *
     * @returns {Array}
     */
    this.getTextures = function () {

        return _textures;
    };

    /**
     * Get loaded file
     *
     * @param {string} name
     * @param {boolean} [parse] - if true return object
     * @returns {?(string|object)}
     */
    this.getFile = function ( name, parse ) {

        var file = _files.find(function( value ) {
            return value.name == name;
        });

        if ( file ) {
            if ( parse === true && typeof file.json === 'string') {
                return JSON.parse( file.json );
            } else if ( parse === false && typeof file.json == 'object' ) {
                return JSON.stringify( file.json );
            }

            return file.json;
        } else {
            return null;
        }
    };

    /**
     * Get loaded files
     *
     * @returns {Array}
     */
    this.getFiles = function () {
        return _files;
    };

    /**
     * Add data for model upload
     *
     * @param {!(string|number)} name
     * @param {?string} label
     * @param {string} directory
     * @param {string} pathOBJ
     * @param {string} [pathMTL]
     * @returns {IW.MultiLoader}
     */
    this.addLoadOBJ = function ( name, label, directory, pathOBJ, pathMTL ) {

        this.upload.push( {
            type: IW.MultiLoader.LOAD_TYPE_OBJ,
            object: null,
            name: name,
            label: label,
            pathOBJ: pathOBJ,
            pathMTL: pathMTL,
            directory: directory
        } );

        return this;
    };

    /**
     *
     * @param {*} config
     * @return {IW.MultiLoader}
     */
    this.addLoad = function ( config ) {
        for ( var type in config ) {
            if ( config.hasOwnProperty( type ) ) {
                for ( var i = 0; i < config[ type ].length; i++ ) {
                    var setting = config[ type ][ i ];
                    switch ( type ) {
                        case "OBJ":
                            setting[ 'type' ] = IW.MultiLoader.LOAD_TYPE_OBJ;
                            setting[ 'object' ] = null;
                            break;
                        case "JSON":
                            setting[ 'type' ] = IW.MultiLoader.LOAD_TYPE_OBJ;
                            setting[ 'json' ] = null;
                            break;
                        case "TEXTURE":
                            setting[ 'type' ] = IW.MultiLoader.LOAD_TYPE_TEXTURE;
                            setting[ 'texture' ] = null;
                            break;
                    }
                }
            }
        }
        return this;
    };

    /**
     *
     * Add data for textures upload
     *
     * @param {!(string|number)} name
     * @param {?string} label
     * @param {!string} path
     * @returns {IW.MultiLoader}
     */
    this.addLoadTexture = function (name, label, path) {

        this.upload.push( {
            type: IW.MultiLoader.LOAD_TYPE_TEXTURE,
            texture: null,
            name: name,
            label: label,
            pathTexture: path
        } );

        return this;
    };

    /**
     *
     * Add data for upload json
     *
     * @param {!(string|number)} name
     * @param {?string} label
     * @param {!string} path
     * @param {boolean} [parse] - if true the string will be pars to object
     * @returns {IW.MultiLoader}
     */
    this.addLoadJSON = function (name, label, path, parse) {
        this.upload.push( {
            type: IW.MultiLoader.LOAD_TYPE_JSON,
            json: null,
            name: name,
            label: label,
            path: path,
            parse: parse
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
     * @private
     */
    var _objLoader = new THREE.OBJLoader( manager );

    /**
     *
     * @type {THREE.MTLLoader}
     * @private
     */
    var _mtlLoader = new THREE.MTLLoader( manager );

    /**
     *
     * @type {THREE.TextureLoader}
     * @private
     */
    var _textureLoader = new THREE.TextureLoader( manager );

    /**
     *
     * @type {THREE.FileLoader}
     */
    var _fileLoader = new THREE.FileLoader( manager );

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
    this.hideLabelProgress = function (flag) {

        if (flag !== false) {
            progressBar.hideLabel();
        }

        return this;
    };

    /**
     * Callback for adding action when all objects has loaded
     *
     * @param {doneLoadCallback} callback
     */
    this.load = function ( callback ) {

        doneLoad = callback;
        progressBar.open();
        progressBar.setCountUpload( countUpload( this.upload ) );
        startLoad();
    };

    /**
     *
     * @param {Array} uploads
     * @returns {number}
     */
    function countUpload(uploads) {

        var count = 0;

        for (var i = 0; i < uploads.length; i++) {

            switch (uploads[i]['type']) {
                case IW.MultiLoader.LOAD_TYPE_JSON:
                    count++;
                    break;

                case IW.MultiLoader.LOAD_TYPE_TEXTURE:
                    count++;
                    break;

                case IW.MultiLoader.LOAD_TYPE_OBJ:
                    count += 2;
                    break;
            }
        }

        return count;
    }

    /**
     * Start upload
     *
     * @returns {void}
     */
    function startLoad() {

        var params = scope.upload[ 0 ];

        if ( params == undefined ) {

            if ( doneLoad ) {

                progressBar.doneCallback( doneLoad );
            }

            return;
        }

        scope.upload.splice(0, 1);

        switch (params.type) {

            case IW.MultiLoader.LOAD_TYPE_JSON:

                loadJSON( params );
                break;

            case IW.MultiLoader.LOAD_TYPE_TEXTURE:

                loadTexture( params );
                break;

            case IW.MultiLoader.LOAD_TYPE_OBJ:

                if ( params.pathMTL != undefined ) {

                    loadMaterial( params );

                } else {

                    loadOBJ( params );
                }

                break
        }
    }

    /**
     * Start upload object ( model )
     *
     * @param {{ name: string, pathOBJ: string, object: ?Mesh, pathMTL: string, directory: string }} params
     * @returns {void}
     */
    function loadOBJ( params ) {

        progressBar.setLabel( params.label );

        _objLoader.setPath( params.directory );

        _objLoader.load(
            params.pathOBJ,
            function ( object ) {

                var group = new THREE.Object3D();
                group.add( object );

                params.object = group;
                _objects.push( params );

                if ( _objectLoadedCallback ) {
                    _objectLoadedCallback.call( this, params );
                }

                startLoad();

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

        progressBar.setLabel( params.label );

        _mtlLoader.setTexturePath( params.directory );
        _mtlLoader.setPath( params.directory );
        _mtlLoader.load(
            params.pathMTL,
            function( materials ) {

                materials.preload();
                _objLoader.setMaterials( materials );

                loadOBJ( params );

            },
            progressBar.onProgress,
            progressBar.onError
        );
    }

    function loadTexture( params ) {

        progressBar.setLabel( params.label );

        _textureLoader.load(
            params.pathTexture,
            function ( texture ) {

                params[ 'texture' ] = texture;
                _textures.push( params );

                if ( _objectLoadedCallback ) {
                    _objectLoadedCallback.call( this, params );
                }

                startLoad();
            },
            progressBar.onProgress,
            progressBar.onError
        );
    }
    
    function loadJSON( params ) {

        progressBar.setLabel( params.label );

        _fileLoader.load(
            params.path,
            function ( text ) {

                params['json'] = params.parse ? JSON.parse( text ) : text;

                _files.push( params );

                if ( _objectLoadedCallback ) {
                    _objectLoadedCallback.call( this, params );
                }

                startLoad();
            },
            progressBar.onProgress,
            progressBar.onError
        );
    }
};

IW.MultiLoader.LOAD_TYPE_TEXTURE = 1;
IW.MultiLoader.LOAD_TYPE_OBJ = 2;
IW.MultiLoader.LOAD_TYPE_JSON = 3;