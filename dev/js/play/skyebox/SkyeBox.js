import * as THREE from 'three';
import Shader from './../../shaders/Shader';
import IMGLoader from '../loader/IMGLoader';


class SkyeBox {
    /**
     *
     * @param {Scene} scene
     */
    constructor(scene) {

        /**
         *
         * @type {Scene}
         * @private
         */
        this._scene = scene;

        /**
         *
         * @type {number}
         * @private
         */
        this._size = 50000;

	    /**
	     *
	     * @type {number}
	     * @private
	     */
	    this._wSegments = 25;

	    /**
	     *
	     * @type {number}
	     * @private
	     */
	    this._hSegments = 25;

        /**
         *
         * @type {?Mesh}
         * @private
         */
        this._environment = null;

	    /**
	     *
	     * @type {IMGLoader}
	     * @private
	     */
	    this._textureLoader = IMGLoader.get();

	    /**
	     *
	     * @type {boolean}
	     * @private
	     */
	    this._isEnv = false;
    }

	/**
	 *
	 * @return {boolean}
	 */
	get isEnv() {
    	return this._isEnv;
    }

    /**
     *
     * @param {Vector3} value
     * @returns {SkyeBox}
     */
    setPosition(value) {
	    this._environment.position.copy(value);
        return this;
    }

    /**
     * Build environment and add to scene
     *
     * @param {string} path
     * @returns {SkyeBox}
     */
    buildEnv(path) {
	    this.removeEnv();
	    let material = new THREE.ShaderMaterial({
		    uniforms: {
			    texture: {type: 't', value: this._textureLoader.find(path)}
		    },
		    vertexShader: Shader.get().add(`
		        varying vec2 vUV;
                
                void main() {  
                  vUV = uv;
                  vec4 pos = vec4(position, 1.0);
                  gl_Position = projectionMatrix * modelViewMatrix * pos;
                }
		    `).getContent(),
		    fragmentShader: Shader.get().add(`
		        uniform sampler2D texture;  
                varying vec2 vUV;
                
                void main() {  
                  vec4 sample = texture2D(texture, vUV);
                  gl_FragColor = vec4(sample.xyz, sample.w);
                }
		    `).getContent()
	    });

	    this._environment = new THREE.Mesh(new THREE.SphereGeometry(this._size, this._wSegments, this._hSegments), material);
	    this._environment.scale.set(-1, 1, 1);
	    this._environment.rotation.order = 'XZY';
	    this._environment.renderDepth = this._size;
	    this._scene.add(this._environment);
	    this._isEnv = true;
        return this;
    }

	/**
	 * Remove SkyBox from the scene
	 *
	 * @returns {SkyeBox}
	 */
	removeEnv() {
    	if (this._isEnv) {
		    this._scene.remove(this._environment);
		    this._isEnv = false;
	    }
	    return this;
    }
}

export default SkyeBox;