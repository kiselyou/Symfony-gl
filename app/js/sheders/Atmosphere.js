var IW = IW || {};

IW.Atmosphere = function () {

    var vertexShader  = [
        'varying vec3 vNormal;',
        'void main(){',
        '  // compute intensity',
        '  vNormal    = normalize( normalMatrix * normal );',
        '  // set gl_Position',
        '  gl_Position  = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}',
    ].join('\n');

    var fragmentShader  = [
        'uniform float coeficient;',
        'uniform float power;',
        'uniform vec3  glowColor;',
        'varying vec3  vNormal;',
        'void main(){',
        '  float intensity  = pow( coeficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power );',
        '  gl_FragColor  = vec4( glowColor * intensity, 1.0 );',
        '}',
    ].join('\n');

    /**
     * Create custom material from the shader code above that is within specially labeled script tags
     *
     * @returns {ShaderMaterial|*}
     */
    this.getMaterial = function () {
        return new THREE.ShaderMaterial({
            uniforms: {
                coeficient: {
                    type: 'f',
                    value: 1.0
                },
                power: {
                    type: 'f',
                    value: 2
                },
                glowColor: {
                    type: 'c',
                    value: new THREE.Color(0xffffff)
                },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
    };
};
