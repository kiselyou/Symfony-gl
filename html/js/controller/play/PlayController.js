var IW = IW || {};

/**
 *
 * @param {{
 *      skybox: { path: string, names: [ 'px', 'nx', 'py', 'ny', 'pz', 'nz' ], extension: string, label: string }
 * }} userConfig
 * @constructor
 */
IW.PlayController = function ( userConfig ) {

    /**
     *
     * @type {!string}
     */
    this.basePath = '';

    /**
     *
     * @type {IW.MultiLoader}
     */
    this.multiLoader = new IW.MultiLoader();

    var sprites = {
        names: ['sprite-explosion2', 'smokeparticle'],
        extension: '.png'
    };

    /**
     *
     * @type {{room: string, names: string[], extension: string}}
     */
    var skyBox = {
        room: 'A',
        names: [ 'px', 'nx', 'py', 'ny', 'pz', 'nz' ],
        extension: '.png'
    };

    /**
     *
     * @type {string[]}
     */
    var json = [ 'action', 'weapon' ];

    /**
     *
     * @type {*[]}
     */
    var models = [
        { type: 'S1', name: 'iw-ship' },
        { type: 'R1', name: 'iw-rocket' }
    ];

    /**
     *
     * @returns {IW.PlayController}
     */
    this.loadSprites = function () {
        for ( var i = 0; i < sprites.names.length; i++ ) {
            var path = this.basePath + IW.PlayController.DIR_SPRITES + '/' + sprites.names[ i ] + sprites.extension;
            this.multiLoader.addLoadTexture( sprites.names[ i ], IW.PlayController.LBL_LOAD_SPRITES, path );
        }
        return this;
    };

    /**
     *
     * @returns {IW.PlayController}
     */
    this.loadSkyBox = function () {
        for ( var i = 0; i < skyBox.names.length; i++ ) {
            var path = this.basePath + IW.PlayController.DIR_SKYBOX + '/' + skyBox.room + '/' + skyBox.names[ i ] + skyBox.extension;
            this.multiLoader.addLoadTexture( skyBox.names[ i ], IW.PlayController.LBL_LOAD_SKYBOX, path );
        }
        return this;
    };

    /**
     *
     * @returns {IW.PlayController}
     */
    this.loadJson = function () {
        for ( var i = 0; i < json.length; i++ ) {
            var path = this.basePath + IW.PlayController.DIR_CONFIG + '/' + json[ i ] + '.json';
            this.multiLoader.addLoadJSON( json[ i ], IW.PlayController.LBL_LOAD_CONFIG, path, true );
        }
        return this;
    };

    /**
     *
     * @returns {IW.PlayController}
     */
    this.loadModels = function () {
        for ( var i = 0; i < models.length; i++ ) {
            var conf = models[ i ];
            var path = this.basePath + IW.PlayController.DIR_MODELS + '/' + conf.type + '/' + conf.name + '/';
            this.multiLoader.addLoadOBJ( conf.name, IW.PlayController.LBL_LOAD_MODELS, path, conf.name + '.obj', conf.name + '.mtl' );
        }
        return this;
    };

    /**
     *
     * @returns {IW.PlayController}
     */
    this.start = function () {
        this.multiLoader.load(function () {

        });
        return this;
    };
    
};

IW.PlayController.DIR_SPRITES = '/images/effects';
IW.PlayController.DIR_SKYBOX = '/images/textures/skybox';
IW.PlayController.DIR_CONFIG = '/js/config';
IW.PlayController.DIR_MODELS = '/models';

IW.PlayController.LBL_LOAD_SKYBOX = 'Load Sky Box';
IW.PlayController.LBL_LOAD_MODELS = 'Load Models';
IW.PlayController.LBL_LOAD_CONFIG = 'Load Config';
IW.PlayController.LBL_LOAD_SPRITES = 'Load Sprites';