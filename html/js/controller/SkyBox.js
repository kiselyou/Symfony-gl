var IW = IW || {};

/**
 *
 * @augments IW.Prepare
 * @constructor
 */
IW.SkyBox = function () {

    // Parent constructor
    IW.Prepare.call(this);

    /**
     *
     * @type {number}
     */
    this.width = 20000;

    /**
     *
     * @type {number}
     */
    this.height = 20000;

    /**
     *
     * @type {number}
     */
    this.depth = 20000;

    /**
     *
     * @type {?THREE.Mesh}
     * @private
     */
    this.environment = null;

    /**
     * When skyBox was created
     *
     * @param {IW.SkyBox.environment} environment
     * @callback buildSkuBoxDone
     */

    /**
     * Build Sky Box and set link to position
     *
     * @param {buildSkuBoxDone} event
     * @returns {IW.SkyBox}
     */
    this.buildEnvironment = function ( event ) {

        var materials = [];

        for ( var i = 0; i < this.skyBox.names.length; i++ ) {

            var texture = this.multiLoader.getTexture( this.skyBox.names[ i ] );
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            var material = new THREE.MeshBasicMaterial();
            material.map = texture;
            material.side = THREE.BackSide;
            materials.push( material );
        }

        var geometry = new THREE.BoxGeometry( this.width, this.height, this.depth, 1, 1, 1 );
        this.environment = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
        this.environment.position.copy( new THREE.Vector3() );
        event.call( this, this.environment );
        return this;
    };
};