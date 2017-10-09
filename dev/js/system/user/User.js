import InitScene from './../../play/scene/InitScene';
import UIMainElement from './../ui/UIMainElement';
import Load from './../../play/loader/Loader';
import UIButton from './../ui/form/FFButton';
import SettingVolume from './SettingVolume';
import UIMessage from './../ui/UIMessage';
import Ajax from './../Ajax';

import {
    MODEL_DEFAULT
} from './../../ini/obj.ini';

let user = null;

class User {
    constructor() {

        /**
         *
         * @type {UIMessage}
         * @private
         */
        this._msg = new UIMessage();

        /**
         *
         * @type {SettingVolume}
         * @private
         */
        this._volume = new SettingVolume();

        /**
         *
         * @type {InitScene}
         * @private
         */
        this._scene = InitScene.get();

        /**
         *
         * @type {Loader}
         * @private
         */
        this._loaderModels = Load.get();
    }

    /**
     * This is user data
     *
     * @returns {User}
     */
    static get() {
        return user || (user = new User());
    }

    /**
     * Gets setting of volume
     *
     * @returns {SettingVolume}
     */
    getSettingVolume() {
        return this._volume;
    }

    /**
     *
     * @returns {User}
     */
    resetSettings() {
        this._volume = new SettingVolume();
        return this;
    }

    /**
     * @callback loadSettingsListener
     */

    /**
     * Load setting of user from the server
     *
     * @param {loadSettingsListener} listener
     * @returns {void}
     */
    loadSettings(listener) {
        const msg = 'Cannot get user settings';
        let ajax = new Ajax();
        ajax.post('/user/settings/load', {}, false)
            .then((res) => {
                try {
                    this._volume.setSettings(JSON.parse(res));
                    listener();
                } catch (error) {
                    this._msg.alert(msg);
                }
            })
            .catch((error) => {
                this._msg.alert(msg);
            });
    }

    /**
     * Save settings of user
     *
     * @returns {void}
     */
    saveSettingsVolume() {
        let ajax = new Ajax();
        ajax.post('/user/settings/save', this._volume.getSettings(), false)
            .catch((error) => {
                this._msg.alert('Cannot save user data');
            });
    }

    /**
     *
     * @param {UIElement} container
     * @returns {User}
     */
    addBtnPlay(container) {
        let btn = new UIButton(container);
        btn
            .setValue('Start')
            .setIcon('fa-play')
            .addEvent('click', (e) => {
                this._loaderModels.load((loader) => {

                    let model = loader.getModel(MODEL_DEFAULT);
                    model.position.y = -200;
                    model.position.z = -2500;
                    model.rotation.x = 0.3;
                    this.getScene()
                        .controlsEnabled(true)
                        .add(model);
                    UIMainElement.get().container.hideElement(true);

                });
                this.getScene().removeBackground();
            })
            .buildBtn();
        return this;
    }

    /**
     *
     * @returns {InitScene}
     */
    getScene() {
        return this._scene;
    }

    /**
     *
     * @returns {User}
     */
    setBackground(url) {
        this
            .getScene()
            .setBackground(url);
        return this;
    }

    /**
     *
     * @returns {User}
     */
    initScene() {
        this.getScene()
            .render()
            .show();
        return this;
    }
}

export default User;