import * as THREE from 'three';
import Shader from './../../shaders/Shader';


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
        this._width = 5000;

        /**
         *
         * @type {number}
         * @private
         */
        this._height = 5000;

        /**
         *
         * @type {number}
         * @private
         */
        this._depth = 5000;

        /**
         *
         * @type {?Mesh}
         * @private
         */
        this._environment = null;

        /**
         *
         * @type {Array}
         * @private
         */
        this._sides = [
            './src/img/background/default.jpg',
            './src/img/background/default.jpg',
            './src/img/background/default.jpg',
            './src/img/background/default.jpg',
            './src/img/background/default.jpg',
            './src/img/background/default.jpg'
        ];

        /**
         *
         * @type {Vector3}
         * @private
         */
        this._position = new THREE.Vector3();

        this._skyCover = null;
    }

    /**
     *
     * @param {Vector3} value
     * @returns {SkyeBox}
     */
    setPosition(value) {
        this._environment.position.x = value.x;// / 2;
        this._environment.position.y = value.y;// / 2;
        this._environment.position.z = value.z;// / 2;
        return this;
    }

    /**
     *
     * @returns {SkyeBox}
     */
    buildEnvironment() {

	    let skyGeo = new THREE.SphereGeometry(3000, 25, 25);
	    let loader  = new THREE.TextureLoader(),
		    texture = loader.load('./src/img/skybox/005_space.jpg');

	    let material = new THREE.ShaderMaterial({
		    uniforms: {
			    texture: {type: 't', value: texture}
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

	    this._environment = new THREE.Mesh(skyGeo, material);
	    this._environment.scale.set(-1, 1, 1);
	    this._environment.rotation.order = 'XZY';
	    this._environment.renderDepth = 5000.0;
	    this._scene.add(this._environment);






        // let material = new THREE.MeshPhongMaterial({map: texture});
        // this._environment = new THREE.Mesh(skyGeo, material);
        // this._environment.material.side = THREE.BackSide;
        // this._scene.add(this._environment);




        // let materials = [];
        // for (let side of this._sides) {
        //     let texture = new THREE.TextureLoader().load(side);
        //     texture.wrapS = THREE.RepeatWrapping;
        //     texture.wrapT = THREE.RepeatWrapping;
        //     // texture.repeat.set(3, 3);
        //
        //     let material = new THREE.MeshBasicMaterial();
        //     material.map = texture;
        //     material.side = THREE.BackSide;
        //     materials.push(material);
        // }
        //
        // let geometry = new THREE.BoxGeometry(this._width, this._height, this._depth, 1, 1, 1);
        // this._environment = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        // this._scene.add(this._environment);
        return this;
    }

    update() {
        // if (this._skyCover) {
        //     this._skyCover.rotation.y += 0.00001;
        // }
    }
}

export default SkyeBox;