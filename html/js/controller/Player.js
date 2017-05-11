var IW = IW || {};

/**
 *
 * @augments IW.Prepare
 * @constructor
 */
IW.Player = function () {

    // Parent constructor
    IW.Prepare.call( this );

    this.socket = new IW.Socket();
};