import View from './../../view/View';
import UIElement from './../ui/UIElement';
import {VIEW_NAME_PROGRESS_AJAX} from './../../ini/ejs-ini';

const VIEW_BLOCK_STATUS = 'status';
let progressAjax = null;

class ProgressAjax extends View {
    constructor() {
        super();

        /**
         *
         * @type {number}
         * @private
         */
        this._max = 0;

        /**
         *
         * @type {number}
         * @private
         */
        this._loaded = 0;

        /**
         * It is template of EJS
         *
         * @type {UIElement}
         */
        this.build(VIEW_NAME_PROGRESS_AJAX);

        /**
         * This element has status
         *
         * @type {UIElement}
         * @private
         */
        this._blockStatus = this.getViewBlock(VIEW_BLOCK_STATUS);
    }

    /**
     *
     * @returns {ProgressAjax}
     */
    static get() {
        return progressAjax || (progressAjax = new ProgressAjax());
    }

    /**
     * Get Percent
     *
     * @param {number} max
     * @param {number} loaded
     * @returns {number}
     * @static
     * @private
     */
    static getPercent(max, loaded) {
        return Math.floor((loaded / max) * 100);
    }

    /**
     * Update Status Progress
     *
     * @param {number} max
     * @param {number} loaded
     * @returns {ProgressAjax}
     */
    updateProgress(max, loaded) {
        this._max = ProgressAjax.getPercent(max, loaded);
        return this;
    }

    /**
     * Start Progress
     *
     * @returns {ProgressAjax}
     */
    start() {
        this.show();
        let timerID = setInterval(() => {
            if (this._loaded < this._max) {
                this._loaded++;
                this._blockStatus.setText(this._loaded + '%');
            }
            if (this._loaded >= 100) {
                this.hide();
                this._max = 0;
                this._loaded = 0;
                clearInterval(timerID);
            }
        }, 5);
        return this;
    }

    /**
     * Stop Progress
     *
     * @returns {ProgressAjax}
     */
    stop() {
        this._max = 100;
        return this;
    }
}

export default ProgressAjax;