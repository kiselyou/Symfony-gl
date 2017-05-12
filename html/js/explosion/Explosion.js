var IW = IW || {};

/**
 *
 * @param {IW.Model} model
 * @augments IW.ExplosionOptions
 * @constructor
 */
IW.Explosion = function ( model ) {

    // Parent constructor
    IW.ExplosionOptions.call( this );

    this.model = model;

    /**
     *
     * @type {IW.Explosion}
     */
    var scope = this;

    var group_1 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: this.model.multiLoader.getTexture( IW.Prepare.SPRITE_SMOKE )
        },
        blending: THREE.AdditiveBlending
    } );

    group_1.addPool( 1, this.sting, true );

    var group_2 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: this.model.multiLoader.getTexture( IW.Prepare.SPRITE_EXPLOSION ),
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

    var group_3 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: this.model.multiLoader.getTexture( IW.Prepare.SPRITE_SMOKE )
        },
        blending: THREE.AdditiveBlending
    } );

    group_3
        .addPool( 1, this.debris, true )
        .addPool( 2, this.mist, true );

    this.model.scene.add( group_1.mesh );
    this.model.scene.add( group_2.mesh );
    this.model.scene.add( group_3.mesh );

    /**
     * Trigger an explosion
     *
     * @param {string|number} type - possible values ( 1 | 2 )
     * @param {Vector3} position
     * @returns {IW.Explosion}
     */
    this.addEvent = function ( type, position ) {
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