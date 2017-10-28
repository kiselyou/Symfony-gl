import * as THREE from 'three';
import Text3D from './../../play/text/Text3D';
import UIMessage from './../../system/ui/UIMessage';

class SceneBackground {
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
         * @type {Text3D}
         * @private
         */
        this._logo = new Text3D();

        /**
         *
         * @type {?Mesh}
         * @private
         */
        this._backgroundMesh = null;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._backgroundActive = false;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._logoActive = false;

        /**
         *
         * @type {UIMessage}
         */
        this._msg = new UIMessage();

        /**
         *
         * @type {boolean}
         * @private
         */
        this._useAnimation = true;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._farBacground = - 1000;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._farLogo = - 800;

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._sizeLogo = 20;

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._logoText = 'IronWar';
    }

    /**
     *
     * @param {boolean} value
     * @returns {SceneBackground}
     */
    useAnimation(value = true) {
        this._useAnimation = value;
        return this;
    }

    /**
     * Sets Logo
     *
     * @private
     * @returns {SceneBackground}
     */
    setLogo() {
        this._logo
            .setSize(this._sizeLogo)
            .setFar(this._farLogo)
            .showMirror(true)
            .write(this._logoText);

        this._scene.add(this._logo.get());
        this._logoActive = true;
        return this;
    }

    /**
     * Removes logo
     *
     * @returns {SceneBackground}
     */
    removeLogo() {
        this._scene.remove(this._logo.get());
        this._logoActive = false;
        return this;
    }

    /**
     * Sets background and logo
     *
     * @param {string} imgPath
     * @returns {SceneBackground}
     */
    set(imgPath) {
        let loader = new THREE.TextureLoader();
        loader.load(imgPath, (texture) => {
            let width = texture.image.naturalWidth;
            let height = texture.image.naturalHeight;
            this._backgroundMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height, 0),
                new THREE.MeshBasicMaterial({map: texture})
            );

            this._backgroundMesh.position.setZ(this._farBacground);
            this._scene.add(this._backgroundMesh);
            this.setLogo();
            this._backgroundActive = true;
        }, (err) => {
            this._msg.alert('Cannot load texture "' + imgPath + '"');
        });
        return this;
    }

    /**
     * Remove background
     *
     * @param {function} [listener] - Call this function when background is removed
     * @returns {SceneBackground}
     */
    remove(listener) {
        this.removeLogo();
        if (this._backgroundActive) {
            this.hide(this._backgroundMesh, () => {
                this._scene.remove(this._backgroundMesh);
                this._backgroundActive = false;
                if (listener) {
                    listener();
                }
            });
        }
        return this;
    }

    /**
     *
     * @param {Mesh|Group} mesh
     * @param {function} listener
     */
    hide(mesh, listener) {
        if (this._useAnimation) {
            let start = 1;
            let idInterval = setInterval(() => {
                start -= 0.01;
                this.setOpacity(mesh, start);
                if (start <= 0) {
                    this.setOpacity(mesh, 0);
                    clearInterval(idInterval);
                    if (listener) {
                        listener();
                    }
                }
            }, 15);
        } else {
            this.setOpacity(mesh, 0);
            if (listener) {
                listener();
            }
        }
    }

    /**
     *
     * @param {Mesh|Group} mesh
     * @param {number} value
     * @returns {SceneBackground}
     */
    setOpacity(mesh, value) {
        mesh.material.transparent = true;
        mesh.material.opacity = value;
        return this;
    }

    /**
     * To animate logo call this method inside a render
     *
     * @returns {void}
     */
    update() {
        if (this._logoActive) {
            this._logo.animation();
        }
    }
}

export default SceneBackground;