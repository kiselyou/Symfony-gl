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

        /**
         *
         * @type {PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera(45, InitScene.aspect, 0.1, 20000);
        this.camera.position.set(300, 300, 300);
        this.camera.lookAt(this.scene.position);

        /**
         *
         * @type {WebGLRenderer}
         */
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

        /**
         *
         * @type {HemisphereLight}
         */
        this.hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1);
        this.hemisphereLight.position.set(0, 1000, 1000);
        this.scene.add(this.hemisphereLight);
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
     * Render scene
     *
     * @returns {InitScene}
     */
    draw() {
        this.renderer.setSize(InitScene.width, InitScene.height);
        this.container.appendChild(this.renderer.domElement);
        this._render();
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
    _render() {
        let delta = this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this._render();
        });
    }
}

export default InitScene;
