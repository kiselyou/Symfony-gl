
import ViewControls from './../../ViewControls';
import User from './../../../system/user/User';
import Lock from './../../../system/Lock';
import {
    VIEW_NAME_TAB_SOUNDS
} from './../../../ini/ejs.ini';

class TabSounds extends ViewControls {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {
        super(container);



        /**
         *
         * @type {User}
         * @private
         */
        this._user = User.get();

        /**
         *
         * @type {Lock}
         * @private
         */
        this._lock = Lock.get();
    }

    /**
     *
     * @returns {TabSounds}
     */
    buildTab() {
        this.viewOptions = this._user.getSettingVolume().getSettings();
        this
            .autoCleanContainer(true)
            .build(VIEW_NAME_TAB_SOUNDS)
            .showView();

        this._initEvents();
        return this;
    }

    /**
     * Set watcher to the fields of volume
     *
     * @private
     */
    _initEvents() {
        this.getViewBlock('form_volume')
            .formFields((field) => {
                field.addEvent('change', () => {
                    this._user
                        .getSettingVolume()
                        .set(field);
                    this._user
                        .saveSettingsVolume();
                });
            });
    }

    /**
     *
     * @returns {TabSounds}
     */
    lockControls() {
        this._lock.addEventChangeStatus((status) => {
            if (status) {
                this._user.loadSettings();
            } else {
                this._user.resetSettings();
            }
            this.removeView();
            this.buildTab();
        });
        return this;
    }
}

export default TabSounds;