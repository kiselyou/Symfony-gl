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
        this.scene.fog = new THREE.Fog(0x000000, 250, 2500);


        /**
         *
         * @type {PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera(30, InitScene.aspect, 0.1, 20000);
        this.camera.position.set(0, 0, 700);
        this.camera.lookAt(this.scene.position);

        /**
         *
         * @type {WebGLRenderer|THREE.WebGLRenderer}
         */
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        this.renderer.setClearColor(this.scene.fog.color);
        this.renderer.setPixelRatio(window.devicePixelRatio);

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
