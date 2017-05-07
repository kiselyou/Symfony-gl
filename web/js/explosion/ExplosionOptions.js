var IW = IW || {};

/**
 *
 * @constructor
 */
IW.ExplosionOptions= function () {

    this.sting = {
        type: SPE.distributions.SPHERE,
        position: {
            spread: new THREE.Vector3( 5 ),
            radius: 3
        },
        velocity: {
            value: new THREE.Vector3( 150 )
        },
        size: {
            value: [ 30, 40 ]
        },
        opacity: {
            value: [0.5, 0]
        },
        color: {
            value: [new THREE.Color('yellow'),new THREE.Color('red')]
        },
        particleCount: 20,
        alive: true,
        duration: 0.05,
        maxAge: {
            value: 0.1
        }
    };

    this.fireball = {
        particleCount: 10,
        type: SPE.distributions.SPHERE,
        position: {
            radius: 0.1
        },
        maxAge: { value: 1 },
        // duration: 1,
        activeMultiplier: 40,
        velocity: {
            value: new THREE.Vector3( 30 )
        },
        size: { value: [50, 60] },
        color: {
            value: [
                new THREE.Color( 0.5, 0.1, 0.05 ),
                new THREE.Color( 0.2, 0.2, 0.2 ),
                new THREE.Color( 0.2, 0.1, 0.4 )
            ]
        },
        opacity: { value: [0.5, 0.35, 0.1, 0] }
    };

    this.debris = {
        particleCount: 50,
        type: SPE.distributions.SPHERE,
        position: {
            radius: 0.1
        },
        maxAge: {
            value: 1
        },
        // duration: 2,
        activeMultiplier: 40,
        velocity: {
            value: new THREE.Vector3( 100 )
        },
        acceleration: {
            value: new THREE.Vector3( 0, -20, 0 ),
            distribution: SPE.distributions.BOX
        },
        size: { value: 2 },
        drag: {
            value: 1
        },
        color: {
            value: [
                new THREE.Color( 1, 1, 1 ),
                new THREE.Color( 1, 1, 0 ),
                new THREE.Color( 1, 0, 0 ),
                new THREE.Color( 0.4, 0.2, 0.1 )
            ]
        },
        opacity: { value: [0.4, 0] }
    };

    this.mist = {
        particleCount: 20,
        position: {
            spread: new THREE.Vector3( 10, 10, 10 ),
            distribution: SPE.distributions.SPHERE
        },
        maxAge: { value: 1 },
        // duration: 1,
        activeMultiplier: 200,
        velocity: {
            value: new THREE.Vector3( 8, 3, 10 ),
            distribution: SPE.distributions.SPHERE
        },
        size: { value: 50 },
        color: {
            value: new THREE.Color( 0.2, 0.2, 0.2 )
        },
        opacity: { value: [0, 0, 0.2, 0] }
    };
};
