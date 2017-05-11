var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Prepare = function () {

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

    /**
     *
     * @type {{}}
     */
    this.ajaxData = {};

    /**
     *
     * @type {{names: string[], extension: string}}
     */
    var sprites = {
        names: ['sprite-explosion2', 'smokeparticle'],
        extension: '.png'
    };

    /**
     *
     * @type {{room: string, names: string[], extension: string}}
     */
    this.skyBox = {
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
     * @type {IW.Prepare}
     */
    var scope = this;

    /**
     *
     * @returns {IW.Prepare}
     */
    this.loadSprites = function () {
        for ( var i = 0; i < sprites.names.length; i++ ) {
            var path = this.basePath + IW.Prepare.DIR_SPRITES + '/' + sprites.names[ i ] + sprites.extension;
            this.multiLoader.addLoadTexture( sprites.names[ i ], IW.Prepare.LBL_LOAD_SPRITES, path );
        }
        return this;
    };

    /**
     *
     * @returns {IW.Prepare}
     */
    this.loadSkyBox = function () {
        for ( var i = 0; i < this.skyBox.names.length; i++ ) {
            var path = this.basePath + IW.Prepare.DIR_SKYBOX + '/' + this.skyBox.room + '/' + this.skyBox.names[ i ] + this.skyBox.extension;
            this.multiLoader.addLoadTexture( this.skyBox.names[ i ], IW.Prepare.LBL_LOAD_SKYBOX, path );
        }
        return this;
    };

    /**
     *
     * @returns {IW.Prepare}
     */
    this.loadJson = function () {
        for ( var i = 0; i < json.length; i++ ) {
            var path = this.basePath + IW.Prepare.DIR_CONFIG + '/' + json[ i ] + '.json';
            this.multiLoader.addLoadJSON( json[ i ], IW.Prepare.LBL_LOAD_CONFIG, path, true );
        }
        return this;
    };

    /**
     *
     * @returns {IW.Prepare}
     */
    this.loadModels = function () {
        for ( var i = 0; i < models.length; i++ ) {
            var conf = models[ i ];
            var path = this.basePath + IW.Prepare.DIR_MODELS + '/' + conf.type + '/' + conf.name + '/';
            this.multiLoader.addLoadOBJ( conf.name, IW.Prepare.LBL_LOAD_MODELS, path, conf.name + '.obj', conf.name + '.mtl' );
        }
        return this;
    };

    /**
     * When prepared was done
     *
     * @param {IW.Prepare.multiLoader} multiLoader
     * @param {IW.Prepare.ajaxData} ajaxData
     * @callback prepareDone
     */

    /**
     * Start prepare data
     *
     * @param {prepareDone} done
     * @returns {IW.Prepare}
     */
    this.start = function ( done ) {
        this.multiLoader.load( function () {
            done.call( this, scope.multiLoader, scope.ajaxData );
        } );
        return this;
    };

    /**
     * Run Ajax and start prepare data
     *
     * @param {string} url
     * @param {prepareDone} done
     * @returns {IW.Prepare}
     */
    this.startAjax = function ( url, done ) {
        var ajax = new IW.Ajax();
        ajax.open( url );
        ajax.send(
            function ( data ) {

                try {
                    scope.ajaxData = JSON.parse( data );
                    scope.start( done );
                } catch ( e ) {
                    console.warn(e);
                }
            },
            function () {
                console.warn('Error');
            }
        );

        return this;
    };
};

IW.Prepare.DIR_SPRITES = '/images/effects';
IW.Prepare.DIR_SKYBOX = '/images/textures/skybox';
IW.Prepare.DIR_CONFIG = '/js/config';
IW.Prepare.DIR_MODELS = '/models';

IW.Prepare.LBL_LOAD_SKYBOX = 'Load Sky Box';
IW.Prepare.LBL_LOAD_MODELS = 'Load Models';
IW.Prepare.LBL_LOAD_CONFIG = 'Load Config';
IW.Prepare.LBL_LOAD_SPRITES = 'Load Sprites';