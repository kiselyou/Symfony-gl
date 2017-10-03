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
    }

    /**
     * Sets Logo
     *
     * @private
     * @returns {SceneBackground}
     */
    setLogo() {
        this._logo
            .setSize(40)
            .setFar(-1000)
            .showMirror(true)
            .write('IronWar');

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

            this._backgroundMesh.position.setZ(-1100);
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
     * @returns {SceneBackground}
     */
    remove() {
        this.removeLogo();
        if (this._backgroundActive) {
            this._scene.remove(this._backgroundMesh);
            this._backgroundActive = false;
        }
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