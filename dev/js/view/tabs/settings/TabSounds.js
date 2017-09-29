
import ViewControls from './../../ViewControls';
import User from './../../../system/user/User';
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
    }

    /**
     *
     * @returns {TabSounds}
     */
    buildTab() {
        this
            .autoCleanContainer(true)
            .build(VIEW_NAME_TAB_SOUNDS)
            .showView();

        this._initEvents();
        return this;
    }

    _initEvents() {
        let settingVolume = this._user.getSettingVolume();
        this.getViewBlock('form_volume')
            .formFields((field) => {
                field.addEvent('change', () => {
                    settingVolume.setEffect(10);
                    this._user.saveSettings();
                });
            });
    }
}

export default TabSounds;