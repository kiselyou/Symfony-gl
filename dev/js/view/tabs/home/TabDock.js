import ViewRender from './../../ViewRender';
import PanelFolding from './../../panel/folding/PanelFolding';
import UITable from './../../../system/ui/table/UITable';
import UIButton from './../../../system/ui/form/FFButton';

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
            .addColumnWidth(55)
            .addColumnWidth(30)
            .addColumnWidth(5)
            .addHeadRow()
            .addCell('Information');

        dockInfo
            .addBodyRow()
            .addCell('', (cell) => {
                let btn = new UIButton(cell);
                btn
                    .setType(UIButton.TYPE_INFO)
                    .setSize(UIButton.SIZE_XS)
                    .setName('Space station name:')
                    .setTitle('The name of your station')
                    .buildBtn();
            })
            .addCell('MyName')
            .addCell('', (cell) => {
                let btn = new UIButton(cell);
                btn
                    .setType(UIButton.TYPE_ICON)
                    .setSize(UIButton.SIZE_XS)
                    .setIcon('fa-edit')
                    .buildBtn();
            });

        dockInfo
            .addBodyRow()
            .addCell('', (cell) => {
                let btn = new UIButton(cell);
                btn
                    .setType(UIButton.TYPE_INFO)
                    .setSize(UIButton.SIZE_XS)
                    .setName('Located in sector:')
                    .setTitle('The sector where station is based')
                    .buildBtn();
            })
            .addCell('Sector I')
            .addCell('', (cell) => {
                let btn = new UIButton(cell);
                btn
                    .setType(UIButton.TYPE_ICON)
                    .setSize(UIButton.SIZE_XS)
                    .setIcon('fa-edit')
                    .buildBtn();
            });

        dockInfo
            .addBodyRow()
            .addCell('', (cell) => {
                let btn = new UIButton(cell);
                btn
                    .setType(UIButton.TYPE_INFO)
                    .setSize(UIButton.SIZE_XS)
                    .setName('Coordinates:')
                    .setTitle('The coordinates of station in the sector')
                    .buildBtn();
            })
            .addCell('', (cell) => {
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
            .addCell('');

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