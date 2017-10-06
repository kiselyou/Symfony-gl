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
         * @type {{head: Array, body: Array, foot: Array}}
         * @private
         */
        this._columns = [];

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
     * @param {string} name
     * @param {number} width
     * @returns {UITable}
     */
    addColumn(name, width) {
        this._columns.push({
            name: name,
            width: width
        });
        return this;
    }

    /**
     *
     * @returns {UITableRow}
     */
    addHeadRow() {
        let row = new UITableRow(this._columns['head']);
        this._headRows.push(row);
        return row;
    }

    /**
     *
     * @returns {UITableRow}
     */
    addBodyRow() {
        let row = new UITableRow(this._columns['body']);
        this._bodyRows.push(row);
        return row;
    }

    /**
     *
     * @returns {UITableRow}
     */
    addFootRow() {
        let row = new UITableRow(this._columns['foot']);
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