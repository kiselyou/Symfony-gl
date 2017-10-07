import ViewRender from './../../ViewRender';
import PanelFolding from './../../panel/folding/PanelFolding';
import UITable from './../../../system/ui/table/UITable';

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

            // let panels = new PanelFolding(this.getViewBlock('folding'));
            //
            // panels
            //     .addPanel('General', 'fa-info-circle')
            //     .open(true)
            //     .setContent((panelContent) => {
            //         console.log(panelContent);
            //
            //     });
            //
            // panels
            //     .addPanel('Attack', 'fa-rocket')
            //     .setContent('asdasd');
            //
            // panels
            //     .addPanel('Armor', 'fa-shield')
            //     .setContent('asdasd');
            //
            // panels.buildPanels();

            this._prepareDockInformation();
            this._prepareDockInformation();
            this._preparePanels();

            this.showView();
        });
        return this;
    }

    _prepareDockInformation() {
        let dockInfo = new UITable(this.getViewBlock('dock_information'));

        dockInfo
            .setBorder(true)
            .setSkin(UITable.SKIN_DARK)
            .addColumnWidth(50)
            .addColumnWidth(30)
            .addColumnWidth(10)
            .addHeadRow()
            .addCell('Information');

        dockInfo
            .addBodyRow()
            .addCell('Space station name:')
            .addCell('MyName')
            .addCell('btn');

        dockInfo
            .addBodyRow()
            .addCell('Located in sector:')
            .addCell('Sector I')
            .addCell('btn');

        dockInfo
            .addBodyRow()
            .addCell('Coordinates:')
            .addCell('', (cell) => {
                console.log(cell);
                let coordinates = new UITable(cell);

                coordinates
                    .setSize(UITable.SIZE_XS)
                    .addColumnWidth(1);

                coordinates
                    .addBodyRow()
                    .addCell('X')
                    .addCell(25000);

                coordinates
                    .addBodyRow()
                    .addCell('Y')
                    .addCell(12000);

                coordinates
                    .addBodyRow()
                    .addCell('Z')
                    .addCell(100);

                coordinates.buildCustomTable();

            })
            .addCell('btn');

        dockInfo.buildCustomTable();
    }

    _preparePanels() {
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