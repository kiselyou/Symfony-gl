import PlayerControls from './../../play/player/PlayerControls';
import UIMainElement from './../ui/UIMainElement';
import UIButton from './../ui/form/FFButton';
import SettingVolume from './SettingVolume';
import UIMessage from './../ui/UIMessage';
import Ajax from './../Ajax';
import Lock from './../../system/Lock';

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
	     * @type {PlayerControls}
	     * @private
	     */
        this._player = new PlayerControls();
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
	goToSpace(container) {
        let btn = new UIButton(container);
        btn
            .setValue('Start')
            .setIcon('fa-play')
            .addEvent('click', (e) => {
	            this._player.initScene.show();
				this._player
					.goToSpace(() => {
						UIMainElement.get().container.hideElement(true);
					});
            })
            .buildBtn();
        return this;
    }

	/**
	 *
	 * @returns {User}
	 */
	goToDock() {
		this._player.goToDock(() => {
			this._player.initScene.show();
		});
		return this;
	}

	/**
	 * Remove all elements from the scene and hide it
	 *
	 * @returns {void}
	 */
	destroyScene() {
		this._player.initScene.hide(() => {
			this._player
				.removeEnv()
				.removeShip()
				.removeDock();
		});
	}

    /**
     *
     * @returns {User}
     */
    initScene() {
        this._player.initEvents();
	    this._player
            .initScene
            .addCalculateEvent((deltaTime) => {
                this._player.update(deltaTime);
            })
			.setOpacity(0)
            .render();

		Lock.get().addEventChangeStatus((status) => {
			if (status) {
				this.goToDock();
			} else {
				this.destroyScene();
			}
		});

        return this;
    }
}

export default User;