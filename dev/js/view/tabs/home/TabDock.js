import ViewRender from './../../ViewRender';
import PanelFolding from './../../panel/folding/PanelFolding';

import {
    VIEW_NAME_TAB_DOCK
} from './../../../ini/ejs.ini';

class TabDock extends ViewRender {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {
        super(VIEW_NAME_TAB_DOCK, container);
    }


    /**
     * Builds tab Dock
     *
     * @private
     * @returns {TabDock}
     */
    _buildTab() {
        this.autoCleanContainer(true);
        this.upload(() => {

            let panels = new PanelFolding(this.getViewBlock('folding'));

            panels
                .addPanel('General', 'fa-info-circle')
                .open(true)
                .setContent((panelContent) => {
                    console.log(panelContent);

                });

            panels
                .addPanel('Attack', 'fa-rocket')
                .setContent('asdasd');

            panels
                .addPanel('Armor', 'fa-shield')
                .setContent('asdasd');

            panels.buildPanels();

            this.showView();
        });
        return this;
    }



    /**
     * Builds content by status of user
     *
     * @returns {TabDock}
     */
    buildControls() {
        this.app.lock.addEventChangeStatus((status) => {
            if (status) {
                this._buildTab();
            } else {
                this.removeView();
            }
        });
        return this;
    }
}

export default TabDock;