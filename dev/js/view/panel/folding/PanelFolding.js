import View from './../../View';
import PanelFoldingItem from './PanelFoldingItem';

import {
    VIEW_NAME_FOLDING
} from './../../../ini/ejs.ini';

class PanelFolding extends View {
    constructor(container) {
        super(container);

        /**
         *
         * @type {Array.<PanelFoldingItem>}
         * @private
         */
        this._options = [];
    }

    /**
     * Add panel
     *
     * @param {string} title
     * @param {?string} icon
     * @returns {PanelFoldingItem}
     */
    addPanel(title, icon) {
        let item = new PanelFoldingItem();
        item
            .setTitle(title)
            .setIcon(icon);

        this._options.push(item);
        return item;
    }

    /**
     *
     * @returns {PanelFolding}
     */
    buildPanels() {
        this.viewOptions = this._options;
        this
            .build(VIEW_NAME_FOLDING)
            .showView();

        this._initEvents();
        return this;
    }

    /**
     *
     * @private
     */
    _initEvents() {
        for (let item of this._options) {
            let panel = this.getViewBlock(item.uuid);
            let foldingContent = panel.getElementByBlockName('folding_content');
            // Hide by default
            foldingContent.hideElement(false);
            // Set content from listener
            if (item.contentEvent) {
                item.contentEvent(foldingContent);
            }
            // Set event hide|open panel block
            let foldingSwitch = panel.getElementByActionName('folding_switch');
            foldingSwitch.addEvent('click', () => {
                foldingContent.toggleShowOrHide(item.status, true);
                item.setStatus(!item.status);
            });
        }
    }
}

export default PanelFolding;