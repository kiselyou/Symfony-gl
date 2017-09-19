import View from './../../view/View';
import UIElement from './../ui/UIElement';
import {VIEW_NAME_PROGRESS_AJAX} from './../../ini/ejs.ini';

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
         *
         * @type {?number}
         * @private
         */
        this._timerID = null;

        /**
         * Compile EJS template
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
        this.showView();
        if (this._timerID) {
            this.reset();
            return this;
        }
        this._timerID = setInterval(() => {
            if (this._loaded < this._max) {
                this._loaded++;
                this._blockStatus.setText(this._loaded + '%');
            }
            if (this._loaded >= 100) {
                this.hideView();
                this.reset();
                clearInterval(this._timerID);
                this._timerID = null;
            }
        }, 5);
        return this;
    }

    /**
     * Reset options of progress
     *
     * @returns {ProgressAjax}
     */
    reset() {
        this._max = 0;
        this._loaded = 0;
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