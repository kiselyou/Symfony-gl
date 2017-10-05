import UITableRow from './UITableRow';
import View from './../../../view/View';
import {
    VIEW_NAME_CUSTOM_TABLE
} from './../../../ini/ejs.ini';

class UITable extends View {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {
        super(container);
        /**
         *
         * @type {Array.<UITableRow>}
         * @private
         */
        this._headRows = [];

        /**
         *
         * @type {Array.<UITableRow>}
         * @private
         */
        this._bodyRows = [];

        /**
         *
         * @type {Array.<UITableRow>}
         * @private
         */
        this._footRows = [];
    }

    /**
     *
     * @returns {UITableRow}
     */
    addHeadRow() {
        let row = new UITableRow();
        this._headRows.push(row);
        return row;
    }

    /**
     *
     * @returns {UITableRow}
     */
    addBodyRow() {
        let row = new UITableRow();
        this._bodyRows.push(row);
        return row;
    }

    /**
     *
     * @returns {UITableRow}
     */
    addFootRow() {
        let row = new UITableRow();
        this._footRows.push(row);
        return row;
    }

    /**
     * Build custom table
     *
     * @returns {UITable}
     */
    buildCustomTable() {
        this._prepareOptions();
        this
            .build(VIEW_NAME_CUSTOM_TABLE)
            .showView();
        return this;
    }

    /**
     * Prepare options
     *
     * @returns {void}
     * @private
     */
    _prepareOptions() {
        this.viewOptions = {
            headRows: this._headRows,
            bodyRows: this._bodyRows,
            footRows: this._footRows
        };
    }
}

export default UITable;