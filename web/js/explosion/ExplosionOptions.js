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
};
