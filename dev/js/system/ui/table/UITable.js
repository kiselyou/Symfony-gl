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
         * @type {Array.<{width: ?number}>}
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

        /**
         *
         * @type {?string}
         * @private
         */
        this._border = null;

        /**
         *
         * @type {?string}
         * @private
         */
        this._skin = null;

        /**
         *
         * @type {?string}
         * @private
         */
        this._size = UITable.SIZE_SM;

        /**
         *
         * @type {string}
         * @private
         */
        this._margin = 'mg_xs';
    }

    /**
     *
     * @returns {string}
     */
    static get SKIN_DARK() {
        return 'table__skin_dark';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_XS() {
        return 'table_xs';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_SM() {
        return 'table_sm';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_MD() {
        return 'table_md';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get SIZE_LG() {
        return 'table_lg';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get _BORDER() {
        return 'table__border';
    }

    /**
     *
     * @param {string} value - This is constants of current class
     * @returns {UITable}
     */
    setSkin(value) {
        this._skin = value;
        return this;
    }

    /**
     *
     * @param {string} value - This is constants of current class
     * @returns {UITable}
     */
    setSize(value) {
        this._size = value;
        return this;
    }

    /**
     *
     * @param {boolean} show
     * @returns {UITable}
     */
    setBorder(show) {
        this._border = show ? UITable._BORDER : null;
        return this;
    }

    /**
     *
     * @param {number} width
     * @returns {UITable}
     */
    addColumnWidth(width) {
        this._columns.push({
            width: width
        });
        return this;
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
        this._init(this._headRows);
        this._init(this._bodyRows);
        this._init(this._footRows);
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
            skin: this._skin,
            size: this._size,
            border: this._border,
            margin: this._margin,
            columns: this._columns,
            headRows: this._headRows,
            bodyRows: this._bodyRows,
            footRows: this._footRows
        };
    }

    /**
     *
     * @param {Array.<UITableRow>} rows
     * @private
     */
    _init(rows) {
        for (let row of rows) {
            for (let cell of row['cells']) {
                if (cell.contentEvents.length > 0) {
                    for (let listener of cell.contentEvents) {
                        listener(this.getViewAction(cell.uuid));
                    }
                }
            }
        }
    }
}

export default UITable;