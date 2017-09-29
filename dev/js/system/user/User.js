
import SettingVolume from './SettingVolume';
import Ajax from './../Ajax';
import Lock from './../Lock';
import UIMessage from './../ui/UIMessage';

let user = null;

class User {
    constructor() {

        /**
         *
         * @type {Lock}
         */
        this._lock = Lock.get();

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

        this._lock.addEventChangeStatus((status) => {
            console.log(status, 'status');
        });
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
     * Load setting of user from the server
     *
     * @returns {void}
     */
    loadSettings() {
        let ajax = new Ajax();
        ajax.post('/user/settings/load', {}, false)
            .then((res) => {
                console.log(res, 'ss');
            })
            .catch((error) => {
                console.log(error);
                this._msg.alert('Cannot get user data');
            });
    }

    /**
     * Save settings of user
     *
     * @returns {void}
     */
    saveSettings() {
        let ajax = new Ajax();
        ajax.post('/user/settings/save', this._volume, false)
            .then((res) => {
                console.log(res, 'sssss');
            })
            .catch((error) => {
                console.log(error);
                this._msg.alert('Cannot save user data');
            });
    }
}

export default User;