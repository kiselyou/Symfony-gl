
import ViewControls from './../../ViewControls';
import {
    VIEW_NAME_TAB_SOUNDS
} from './../../../ini/ejs.ini';

class TabSounds extends ViewControls {
    constructor(container) {
        super(container);
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
        return this;
    }
}

export default TabSounds;