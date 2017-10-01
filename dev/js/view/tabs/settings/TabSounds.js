
import ViewControls from './../../ViewControls';
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
    }

    /**
     * Builds tab
     *
     * @private
     * @returns {TabSounds}
     */
    _buildTab() {
        this.viewOptions = this.app.user.getSettingVolume().getSettings();
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
                    this.app.user
                        .getSettingVolume()
                        .set(field);
                    this.app.user
                        .saveSettingsVolume();
                });
            });
    }

    /**
     * Builds content by status of user
     *
     * @returns {TabSounds}
     */
    buildControls() {
        this.app.lock.addEventChangeStatus((status) => {
            if (status) {
                this.app.user.loadSettings(() => {
                    this._buildTab();
                });
            } else {
                this.app.user.resetSettings();
                this.removeView();
            }
        });
        return this;
    }
}

export default TabSounds;