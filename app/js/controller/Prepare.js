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
            aim: 'textures/aim/aim.png',
            smoke: 'sprites/smokeparticle.png',
            explosion: 'sprites/sprite-explosion2.png',
            earth_map: 'textures/planets/earth_map.jpg',
            earth_clouds: 'textures/planets/earth_clouds.jpg'
        }
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
     * @type {{ships: *[], rockets: *[]}}
     */
    this.models = {
        ships: ['explorer'],
        rockets: ['iw-rocket']
    };

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
                    this.basePath + IW.Prepare.DIR_SPRITES + '/' + sprites.names[ key ]
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
            var path = this.basePath + IW.Prepare.DIR_TEXTURES + '/skybox/' + this.skyBox.room + '/' + this.skyBox.names[ i ] + this.skyBox.extension;
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
     * Upload only one model
     *
     * @param {string} name - It is name of model
     * @param {string} category - It is category of model
     * @returns {IW.Prepare}
     */
    this.loadModel = function (name, category) {
        var path = this.basePath + IW.Prepare.DIR_MODELS + '/' + category + '/' + name + '/';
        this.multiLoader.addLoadOBJ( name, IW.Prepare.LBL_LOAD_MODELS, path, name + '.obj', name + '.mtl' );
        return this;
    };

    /**
     *
     * @param {Array.<IW.Prepare.models.ships|IW.Prepare.models.rockets>} arr
     * @param {string} category - it is name category of model. Possible values ( 'ships' | 'rockets' )
     * @returns {IW.Prepare}
     */
    this.loadModels = function (arr, category) {
        for ( var i = 0; i < arr.length; i++ ) {
            this.loadModel( arr[ i ], category );
        }
        return this;
    };

    /**
     * Load all configured model
     *
     * @returns {IW.Prepare}
     */
    this.loadAllModels = function () {
        for (var key in this.models) {
            if (this.models.hasOwnProperty(key)) {
                this.loadModels( this.models[key], key );
            }
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
        ajax.post(
            url,
            null,
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

IW.Prepare.DIR_SPRITES = '/images/';
IW.Prepare.DIR_TEXTURES = '/images/textures';
IW.Prepare.DIR_CONFIG = '/js/config';
IW.Prepare.DIR_MODELS = '/models';

IW.Prepare.LBL_LOAD_SKYBOX = 'Environment';
IW.Prepare.LBL_LOAD_MODELS = 'Models';
IW.Prepare.LBL_LOAD_CONFIG = 'Config';
IW.Prepare.LBL_LOAD_SPRITES = 'Sprites';

IW.Prepare.CONFIG_KEY_ACTION = 'action';
IW.Prepare.CONFIG_KEY_WEAPON = 'weapon';

IW.Prepare.SPRITE_SMOKE = 'smoke';
IW.Prepare.SPRITE_EXPLOSION = 'explosion';

IW.Prepare.MODEL_EXPLORER = 'explorer';
IW.Prepare.MODEL_ROCKET_R1 = 'iw-rocket';

IW.Prepare.CATEGORY_SHIPS = 'ships';
IW.Prepare.CATEGORY_ROCKETS = 'rockets';
