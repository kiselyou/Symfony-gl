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

    this._id = THREE.Math.generateUUID();

    this.model = model;

    var group_1 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: this.model.multiLoader.getTexture( IW.Prepare.SPRITE_SMOKE )
        },
        blending: THREE.AdditiveBlending
    } );

    group_1.mesh.frustumCulled = false;
    group_1.addPool( 1, this.sting, true );
    this.model.scene.add( group_1.mesh );

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

    group_2.mesh.frustumCulled = false;
    group_2.addPool( 1, this.fireball, false );
    this.model.scene.add( group_2.mesh );

    var group_3 = new SPE.Group( {
        maxParticleCount: 50000,
        texture: {
            value: this.model.multiLoader.getTexture( IW.Prepare.SPRITE_SMOKE )
        },
        blending: THREE.AdditiveBlending
    } );

    group_3.mesh.frustumCulled = false;
    group_3
        .addPool( 1, this.debris, false )
        .addPool( 2, this.mist, false );

    this.model.scene.add( group_3.mesh );

    /**
     *
     * @type {THREE.Clock}
     */
    var clock = new THREE.Clock();

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
                this._update( 200, function ( dt ) {
                    group_1.tick();
                } );

                break;
            case 2:
                group_2
                    .triggerPoolEmitter( 1, position );
                group_3
                    .triggerPoolEmitter( 1, position )
                    .triggerPoolEmitter( 2, position );

                this._update( 3000, function () {
                    group_2.tick();
                    group_3.tick();
                } );
                break;
        }
        return this;
    };

    /**
     *
     * @param {number} time - It is time life (milliseconds)
     * @param {function} action
     * @returns {void}
     */
    this._update = function ( time, action ) {
        var start = 0;
        var fps = 60;
        var delay = 1000 / fps;
        var dt = clock.getDelta();

        var idInterval = setInterval(function () {
            action.call( this, dt );
            if ( start >= time ) {
                clearInterval(idInterval);
            }
            start += delay;
        }, delay);
    };
};
