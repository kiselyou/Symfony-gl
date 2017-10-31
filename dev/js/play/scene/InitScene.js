import * as THREE from 'three';
import SceneBackground from './SceneBackground';

let scene = null;

const NUMBER_OF_FRAMES = 1000 / 30;

class InitScene {
    constructor() {

        /**
         *
         * @type {Element}
         */
        this.container = document.getElementById('initialisation_main_scene');

		/**
		 *
		 * @type {Clock}
		 * @private
		 */
		this._clockRender = new THREE.Clock();

		/**
		 *
		 * @type {Clock}
		 * @private
		 */
		this._clockCalculate = new THREE.Clock();

        /**
         *
         * @type {Scene}
         */
        this._scene = new THREE.Scene();
        // this._scene.fog = new THREE.Fog(0xffffff, 2500, 3500);

        /**
         *
         * @type {PerspectiveCamera}
         */
        this._camera = new THREE.PerspectiveCamera(40, InitScene.aspect, 0.1, 150000);
        this._camera.lookAt(this._scene.position);

        /**
         *
         * @type {?WebGLRenderer}
         */
        this._renderer = this._webGLRenderer();

	    
        // /**
        //  *
        //  * @type {HemisphereLight|THREE.HemisphereLight}
        //  */
        // this.hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 0.1);
        // // this.hemisphereLight.position.set(0, 1500, 0);
        // this.hemisphereLight.position.set(2500, 200, -2000);
        // this._scene.add(this.hemisphereLight);

        // /**
        //  *
        //  * @type {DirectionalLight|THREE.DirectionalLight}
        //  */
        // this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        // this.directionalLight.position.set(0, 0, 1).normalize();
        // this._scene.add(this.directionalLight);

        // /**
        //  *
        //  * @type {PointLight|THREE.PointLight}
        //  */
        // this.pointLight = new THREE.PointLight(0xFFFFFF, 1);
        // this.pointLight.position.set(0, 200, -2000);
        // this._scene.add(this.pointLight);

        /**
         *
         * @type {Array}
         * @private
         */
        this._renderEvents = [];

        /**
         *
         * @type {Array}
         * @private
         */
        this._calculateEvents = [];

        /**
         *
         * @type {SceneBackground}
         * @private
         */
        this._bg = new SceneBackground(this._scene);

        /**
         *
         * @type {GridHelper}
         * @private
         */
        this._gridHelper = new THREE.GridHelper(1500, 25, 0xcccccc, 0xcccccc);

	    /**
         *
	     * @type {Raycaster}
	     * @private
	     */
	    this._raycaster = new THREE.Raycaster();

	    /**
         *
	     * @type {Vector2}
	     * @private
	     */
	    this._mouse = new THREE.Vector2();
    }

    /**
     *
     * @returns {InitScene}
     */
    showGridHelper(value = true) {
        if (value) {
            this._scene.add(this._gridHelper);
        } else {
			this._scene.remove(this._gridHelper);
		}
        return this;
    }

    /**
     *
     * @returns {InitScene}
     */
    removeGridHelper() {
        this._scene.remove(this._gridHelper);
        return this;
    }

	/**
     *
	 * @returns {*}
	 */
	get domElement() {
        return this._renderer.domElement;
    }

	/**
	 *
	 * @returns {?WebGLRenderer}
	 */
	get renderer() {
		return this._renderer;
	}

	/**
	 *
	 * @returns {Camera}
	 */
	get camera() {
		return this._camera;
	}

	/**
     *
	 * @return {Scene}
	 */
	get scene() {
        return this._scene;
    }

    /**
     *
     * @returns {InitScene}
     */
    static get() {
        return scene || (scene = new InitScene());
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
     * @param {string} imgPath
     * @returns {InitScene}
     */
    setBackground(imgPath) {
        this._bg.set(imgPath);
        return this;
    }

    /**
     * Remove background
     *
     * @param {boolean} useAnimation
     * @param {function} [listener]
     * @returns {InitScene}
     */
    removeBackground(useAnimation, listener) {
        this._bg.useAnimation(useAnimation);
        this._bg.remove(listener);
        return this;
    }

    /**
     * Set opacity scene
     *
     * @param {number} value
     * @returns {InitScene}
     */
    setOpacity(value) {
        this.container.style.opacity = value;
        return this;
    };

    /**
     * @callback animationCompleted
     */

    /**
     * Show Scene
     *
     * @param {animationCompleted} [listener]
     * @returns {InitScene}
     */
    show(listener) {
        let start = 0;
        let idInterval = setInterval(() => {
            start += 0.01;
            this.setOpacity(start);
            if (start >= 1) {
                this.setOpacity(1);
                clearInterval(idInterval);
                if (listener) {
                    listener();
                }
            }
        }, 16);
        return this;
    };

    /**
     * Hide Scene
     *
     * @param {animationCompleted} [listener]
     * @returns {InitScene}
     */
    hide(listener) {
        let start = 1;
        let idInterval = setInterval(() => {
            start -= 0.01;
            this.setOpacity(start);
            if (start <= 0) {
                this.setOpacity(0);
                clearInterval(idInterval);
                if (listener) {
                    listener();
                }
            }
        }, 10);
        return this;
    };

    /**
     *
     *
     * @returns {?WebGLRenderer}
     */
    _webGLRenderer() {
        if (InitScene.detectorWebGL()) {
            let renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setPixelRatio(window.devicePixelRatio);
			renderer.toneMappingExposure = 1;
			renderer.physicallyCorrectLights = true;
			renderer.shadowMap.enabled = true;
			renderer.toneMapping = THREE.ReinhardToneMapping;
			renderer.gammaInput = true;
			renderer.gammaOutput = true;

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
        this._scene.add(element);
        return this;
    }

    /**
     * Remove element from scene
     *
     * @returns {InitScene}
     */
    remove(element) {
        this._scene.remove(element);
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
        this._calculateControls();
        this._resizeControls();
        return this;
    }

	/**
     * Gets intersections
     *
     * @param {MouseEvent} event
	 * @param {Array.<Mesh|Group>} objects
	 * @param {boolean} [recursive]
	 */
	getClickIntersections(event, objects, recursive = false) {
		this._mouse.x = (event.clientX / this.domElement.clientWidth) * 2 - 1;
		this._mouse.y = - (event.clientY / this.domElement.clientHeight) * 2 + 1;
	    this._raycaster.setFromCamera(this._mouse, this._camera);
	    return this._raycaster.intersectObjects(objects, recursive);
    }

	/**
	 * Gets intersections
	 *
	 * @param {MouseEvent} event
	 * @param {Mesh|Group} object
     * @returns {Object}
	 */
	getClickIntersection(event, object) {
		let intersection = this.getClickIntersections(event, [object], false);
		return intersection[0] ? intersection[0] : {};
	}

    /**
     * Add helper to scene
     *
     * @returns {InitScene}
     */
    helper() {
        let axisHelper = new THREE.AxisHelper(50);
        this._scene.add(axisHelper);
        return this;
    }

    /**
     *
     * @param {number} delta
     * @callback renderEvent
     */

    /**
     *
     * @param {renderEvent} event
     * @returns {InitScene}
     */
    addRenderEvent(event) {
        this._renderEvents.push(event);
        return this;
    }

	/**
	 *
	 * @param {renderEvent} event
	 * @returns {InitScene}
	 */
	addCalculateEvent(event) {
		this._calculateEvents.push(event);
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
            this._camera.aspect = InitScene.aspect;
            this._camera.updateProjectionMatrix();
            this.renderer.setSize(InitScene.width, InitScene.height);
        });
        return this;
    }

	/**
	 * Set calculations
	 *
	 * @private
	 */
	_calculateControls() {
    	setTimeout(() => {
			let delta = this._clockCalculate.getDelta();
			for (let event of this._calculateEvents) {
				event(delta);
			}
			this._calculateControls();
		}, NUMBER_OF_FRAMES);
	}

    /**
     * Render scene
     *
     * @private
     */
    _renderControls() {
        let delta = this._clockRender.getDelta();
        this.renderer.render(this._scene, this._camera);
        requestAnimationFrame(() => {
            for (let event of this._renderEvents) {
                event(delta);
            }
            this._bg.update();
            this._renderControls();
        });
    }
}

export default InitScene;
