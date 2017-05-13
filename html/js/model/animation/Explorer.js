var IW = IW || {};

/**
 *
 * @param {IW.Model} model
 * @constructor
 */
IW.Explorer = function ( model ) {

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    var particleGroup, emitter;

    // Create particle group and emitter
    this.initParticles = function () {

        particleGroup = new SPE.Group({
            maxParticleCount: 50,
            texture: {
                value: this.model.multiLoader.getTexture( IW.Prepare.SPRITE_SMOKE )
            }
        });

        particleGroup.mesh.frustumCulled = false;

        emitter = new SPE.Emitter({
            type: SPE.distributions.BOX,
            position: {
                value: new THREE.Vector3(0, 0, 0)
            },
            velocity: {
                value: new THREE.Vector3(0, 0, -4)
            },
            color: {
                value: [ new THREE.Color(0x1DD898), new THREE.Color( 'blue' ) ],
                spread: new THREE.Vector3(1, 1, 1)
            },
            size: {
                value: [4, 0]
            },
            particleCount: 40
        });

        particleGroup.addEmitter( emitter );
        this.model.scene.add( particleGroup.mesh );
    };

    /**
     * Remove Effect
     *
     * @returns {IW.Explorer}
     */
    this.remove = function () {

        emitter.remove();
        this.model.scene.remove( particleGroup );
        particleGroup = null;
        emitter = null;
        return this;
    };

    /**
     * Update information of current model
     *
     */
    this.update = function () {
        if (particleGroup && emitter) {
            var dt = this.model.getCurrentSpeed() / this.model.getMaxSpeed() + 0.15;
            particleGroup.tick(dt);
            var v = this.model.getPosition();
            emitter.position.value = emitter.position.value.set(v.x, v.y, v.z);


            var far = -4;
            var x = far * Math.cos(this.model.angle);
            var z = far * Math.sin(this.model.angle);
            emitter.velocity.value = emitter.velocity.value.set(x, 0, z);
        }
    }
};
