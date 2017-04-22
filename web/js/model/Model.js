var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Model = function () {

    // Parrent constructor
    // IW.ModelParameters.apply(this, arguments);

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

    this.model = null;
}

IW.Model.prototype = Object.create(IW.ModelParameters.prototype);
IW.Model.prototype.constructor = Model;

/**
 * Get model
 *
 * @returns {Mesh}
 */
IW.Model.prototype.getModel = function () {
    return this.model;
}

/**
 * Load model
 *
 * @param {IW.MultiLoader} multiloader
 * @param {string} [str] - It is JSON data model
 * @returns {IW.Model}
 */
IW.Model.prototype.load = function ( multiloader, str ) {
    if ( str ) {
        this.jsonToObject( str );
    }

    this.model = multiloader.getObject( this.name );
    return this;
}

/**
 * Change model
 *
 * @param {string} name - It is JSON data model
 * @returns {IW.Model}
 */
IW.Model.prototype.changeModel = function ( name ) {

    this.name = name;
    this.model = multiloader.getObject( name );
    return this;
}
