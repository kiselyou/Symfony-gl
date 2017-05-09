var IW = IW || {};

/**
 *
 * @param {IW.MultiLoader} multiLoader
 * @param {THREE.Scene} scene
 * @augments IW.ExplosionOptions
 * @constructor
 */
IW.Explosion = function ( multiLoader, scene ) {

    // Parent constructor
    IW.ExplosionOptions.call( this );

    /**
     *
     * @type {THREE.Scene}
     */
    this.scene = scene;

    var group_1 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: multiLoader.getTexture( 'smoke' )
        },
        blending: THREE.AdditiveBlending
    } );

    group_1.addPool( 1, this.sting, false );

    this.scene.add( group_1.mesh );

    var group_2 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: multiLoader.getTexture( 'explosion' ),
            frames: new THREE.Vector2( 5, 5 ),
            loop: 1
        },
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        scale: 600,
        fixedTimeStep: 0.03
    } );

    group_2.addPool( 1, this.fireball, true );

    this.scene.add( group_2.mesh );

    var group_3 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: multiLoader.getTexture( 'smoke' )
        },
        blending: THREE.AdditiveBlending
    } );

    group_3
        .addPool( 1, this.debris, true )
        .addPool( 2, this.mist, true );

    this.scene.add( group_3.mesh );

    /**
     * Trigger an explosion
     *
     * @param {string|number} type - possible values ( 1 | 2 )
     * @param {Vector3} position
     * @returns {IW.Explosion}
     */
    this.createExplosion = function ( type, position ) {
        switch ( type ) {
            case 1:
                group_1.triggerPoolEmitter( 1, position );
                break;
            case 2:
                group_2
                    .triggerPoolEmitter( 1, position );
                group_3
                    .triggerPoolEmitter( 1, position )
                    .triggerPoolEmitter( 2, position );
                break;
        }
        return this;
    };

    /**
     *
     * @returns {void}
     */
    this.update = function () {
        group_1.tick();
        group_2.tick();
        group_3.tick();
    };
};