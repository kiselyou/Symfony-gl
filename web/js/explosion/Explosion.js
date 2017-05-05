var IW = IW || {};

/**
 *
 * @param {IW.MultiLoader} multiLoader
 * @param {THREE.Scene} scene
 * @augments IW.ExplosionOptions
 * @constructor
 */
IW.Explosion = function ( multiLoader, scene ) {

    /**
     *
     * @type {THREE.Scene}
     */
    this.scene = scene;

    // Parent constructor
    IW.ExplosionOptions.call( this );

    var smoke = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: multiLoader.getTexture( 'smoke' )
        },
        blending: THREE.AdditiveBlending
    } );

    smoke.addPool( 1, this.sting, false );

    this.scene.add( smoke.mesh );

    /**
     * Trigger an explosion
     *
     * @param {string|number} type
     * @param {Vector3} position
     * @returns {IW.Explosion}
     */
    this.createExplosion = function ( type, position ) {
        switch ( type ) {
            case IW.ROCKET_STING:
                smoke.triggerPoolEmitter( 1, position );
                break;
        }
        return this;
    };

    /**
     *
     * @returns {void}
     */
    this.update = function () {
        smoke.tick();
    };
};
