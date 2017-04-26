var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Model = function () {
    
    // Parent constructor
    IW.ModelParameters.call(this);

    this.id = null;

    /**
     *
     * @type {{fly: {forward: {keyName: string, keyCode: number}, left: {keyName: string, keyCode: number}, right: {keyName: string, keyCode: number}, backward: {keyName: string, keyCode: number}}}}
     */
    this.keyboard = {
        fly: {
            forward: {
                keyName: 'up arrow',
                keyCode: 38
            },
            left: {
                keyName: 'left arrow',
                keyCode: 37
            },
            right: {
                keyName: 'right arrow',
                keyCode: 39
            },
            backward: {
                keyName: 'down arrow',
                keyCode: 40
            }
        }
    };

    var _model = null;

    this.getModel = function () {
        return _model;
    };

    this.getPosition = function () {
        return _model ? _model.position : null;
    };

    this.setPosition = function ( x, y, z ) {
        if ( _model ) {
            _model.position.x = x;
            _model.position.y = y;
            _model.position.y = z;
        }
        return this;
    };

    /**
     * Load model
     *
     * @param {IW.MultiLoader} multiLoader
     * @param {string} [str] - It is JSON data model
     * @returns {IW.Model}
     */
    this.load = function ( multiLoader, str ) {
        if ( str ) {
            this.jsonToObject( str );
        }

        _model = multiLoader.getObject( this.name );
        return this;
    };

    /**
     * Change model
     *
     * @param {IW.MultiLoader} multiLoader
     * @param {string} name - It is JSON data model
     * @returns {IW.Model}
     */
    this.changeModel = function ( multiLoader, name ) {
        this.name = name;
        _model = multiLoader.getObject( name );
        return this;
    };

    /**
     * Parent method
     */
    var _parentObjectToJSON = this.objectToJSON;

    /**
     * Get json string of current object
     *
     * @return {string}
     */
    this.objectToJSON = function () {
        this.position.x = _model.position.x;
        this.position.y = _model.position.y;
        this.position.z = _model.position.z;
        return _parentObjectToJSON.call( this, [ 'model' ] );
    };
};