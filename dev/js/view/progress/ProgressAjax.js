import View from './../View';
import UIElement from './../../system/ui/UIElement';
import {VIEW_NAME_PROGRESS_AJAX} from './../../ini/ejs-ini';

const VIEW_BLOCK_STATUS = 'status';
let progressAjax = null;

class ProgressAjax extends View {
    constructor() {
        super();

        /**
         * It is template of EJS
         *
         * @type {UIElement}
         */
        this.build(VIEW_NAME_PROGRESS_AJAX);

        /**
         *
         * @type {number}
         * @private
         */
        this._max = 100;

        /**
         *
         * @type {number}
         * @private
         */
        this._loaded = 0;

        /**
         * It is Timer ID
         *
         * @type {?string}
         * @private
         */
        this._timer = null;

        /**
         *
         * @type {number}
         * @private
         */
        this._percentMove = 0;

        /**
         *
         * @type {number}
         * @private
         */
        this._percentStop = 100;

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
     * Set Timer
     *
     * @private
     */
    _setTimer() {
        this._clearTimer();
        this._timer = setInterval(() => {
            if (this._percentMove >= this._percentStop) {
                this.viewElement.hide();
                this._clearTimer();
            }
            this._blockStatus.setText(this._percentMove + '%');
            this._percentMove += 1;
        }, 15);
    }

    /**
     * Clear Timer
     *
     * @returns {void}
     * @private
     */
    _clearTimer() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    /**
     * Get Percent
     *
     * @returns {number}
     * @private
     */
    _getPercent() {
        return Math.floor((this._loaded / this._max) * 100);
    }

    /**
     * Clear Progress
     *
     * @private
     */
    _clearProgress() {
        this._max = 100;
        this._loaded = 0;
    }

    /**
     * Update Status Progress
     *
     * @param max
     * @param loaded
     * @returns {ProgressAjax}
     */
    update(max, loaded) {
        this._max = max;
        this._loaded = loaded;
        this._percentStop = this._getPercent();
        this._setTimer();
        return this;
    }

    /**
     * Start Progress
     *
     * @returns {ProgressAjax}
     */
    start() {
        this._clearProgress();
        this.viewElement.show();
        this._blockStatus.show(true);
        this._setTimer();
        return this;
    }

    /**
     * Stop Progress
     *
     * @returns {ProgressAjax}
     */
    stop() {
        this.update(100, 100);
        return this;
    }
}

export default ProgressAjax;