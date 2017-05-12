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
        names: {
            smoke: 'smokeparticle',
            explosion: 'sprite-explosion2'
        },
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
    var json = {
        action: 'action',
        weapon: 'weapon'
    };

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
        for ( var key in sprites.names ) {
            if ( sprites.names.hasOwnProperty( key ) ) {
                this.multiLoader.addLoadTexture(
                    key, IW.Prepare.LBL_LOAD_SPRITES,
                    this.basePath + IW.Prepare.DIR_SPRITES + '/' + sprites.names[ key ] + sprites.extension
                );
            }
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
        for ( var key in json ) {
            if ( json.hasOwnProperty( key ) ) {
                this.multiLoader.addLoadJSON(
                    key,
                    IW.Prepare.LBL_LOAD_CONFIG,
                    this.basePath + IW.Prepare.DIR_CONFIG + '/' + json[ key ] + '.json',
                    true
                );
            }
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

IW.Prepare.CONFIG_KEY_ACTION = 'action';
IW.Prepare.CONFIG_KEY_WEAPON = 'weapon';

IW.Prepare.MODEL_SHIP_S1 = 'iw-ship';
IW.Prepare.MODEL_ROCKET_R1 = 'iw-rocket';

IW.Prepare.SPRITE_SMOKE = 'smoke';
IW.Prepare.SPRITE_EXPLOSION = 'explosion';