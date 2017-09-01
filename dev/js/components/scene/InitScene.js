import * as THREE from 'three';

class InitScene {
    /**
     *
     * @param {string} id - Id is id of canvas element
     */
    constructor(id) {

        /**
         *
         * @type {Element}
         */
        this.container = document.getElementById(id);

        /**
         *
         * @type {Clock}
         */
        this.clock = new THREE.Clock();

        /**
         *
         * @type {Scene}
         */
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 250, 3500);


        /**
         *
         * @type {PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera(30, InitScene.aspect, 0.1, 20000);
        this.camera.position.set(0, 0, 700);
        this.camera.lookAt(this.scene.position);

        /**
         *
         * @type {?WebGLRenderer}
         */
        this.renderer = this._webGLRenderer();

        /**
         *
         * @type {HemisphereLight|THREE.HemisphereLight}
         */
        this.hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.3);
        this.hemisphereLight.position.set(0, 1000, 1000);
        this.scene.add(this.hemisphereLight);

        /**
         *
         * @type {DirectionalLight|THREE.DirectionalLight}
         */
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.125);
        this.directionalLight.position.set(0, 0, 1).normalize();
        this.scene.add(this.directionalLight);

        /**
         *
         * @type {PointLight|THREE.PointLight}
         */
        this.pointLight = new THREE.PointLight(0xffffff, 0.5);
        this.pointLight.position.set(0, 100, 90);
        this.scene.add(this.pointLight);


        // Add two lights in the scene
        // An hemisphere light, to add different light from sky and ground
        // var light = new THREE.HemisphereLight(0xffffbb, 0x887979, 0.9);
        // this.scene.add(light);

        /**
         *
         * @type {Array}
         * @private
         */
        this._renderEvents = [];
    }

    /**
     *
     * @returns {number}
     */
    static get width() {
        return window.innerWidth;
    }

    /**
     *
     * @returns {number}
     */
    static get height() {
        return window.innerHeight;
    };

    /**
     *
     * @returns {number}
     */
    static get aspect() {
        return InitScene.width / InitScene.height;
    };

    /**
     * Check if Your graphics card is supporting WebGL.
     *
     * @returns {boolean}
     */
    static detectorWebGL() {
        try {
            let canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /**
     *
     *
     * @returns {?WebGLRenderer}
     */
    _webGLRenderer() {
        if (InitScene.detectorWebGL()) {
            let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
            renderer.setClearColor(this.scene.fog.color);
            renderer.setPixelRatio(window.devicePixelRatio);
            return renderer;
        }
        return null;
    }

    /**
     * Add element to scene
     *
     * @param {Mesh|Group} element
     * @returns {InitScene}
     */
    add(element) {
        this.scene.add(element);
        return this;
    }

    /**
     * Render scene
     *
     * @returns {InitScene}
     */
    render() {
        if (!this.renderer) {
            console.warn('Your graphics card does not support WebGL');
            return this;
        }
        this.renderer.setSize(InitScene.width, InitScene.height);
        this.container.appendChild(this.renderer.domElement);
        this._renderControls();
        this._resizeControls();
        return this;
    }

    /**
     * Add helper to scene
     *
     * @returns {InitScene}
     */
    helper() {
        let axisHelper = new THREE.AxisHelper(50);
        this.scene.add(axisHelper);
        return this;
    }

    /**
     *
     * @param {number} delta
     * @callback renderEvent
     */

    /**
     *
     * @param event
     * @returns {InitScene}
     */
    addRenderEvent(event) {
        this._renderEvents.push(event);
        return this;
    }

    /**
     * Add event "resize" and rebuild scene when it was happened
     *
     * @returns {InitScene}
     * @private
     */
    _resizeControls() {
        window.addEventListener('resize', () => {
            this.camera.aspect = InitScene.aspect;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(InitScene.width, InitScene.height);
        });
        return this;
    }

    /**
     * Render scene
     *
     * @private
     */
    _renderControls() {
        let delta = this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            for (let event of this._renderEvents) {
                event(delta);
            }
            this._renderControls();
        });
    }
}

export default InitScene;
