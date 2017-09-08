import View from './../View';
import UIElement from './../../system/ui/UIElement';
import {VIEW_NAME_PROGRESS_AJAX} from './../view-path';

let progressAjax = null;

class ProgressAjax extends View {
    constructor() {
        super();

        /**
         * It is template of EJS
         *
         * @type {UIElement}
         */
        this._tmp = this.find(VIEW_NAME_PROGRESS_AJAX);
    }

    /**
     *
     * @returns {*|ProgressAjax}
     */
    static get() {
        return progressAjax || (progressAjax = new ProgressAjax());
    }

    /**
     *
     * @returns {ProgressAjax}
     */
    start() {
        this._tmp.show();
        return this;
    }

    /**
     *
     * @returns {ProgressAjax}
     */
    stop() {
        this._tmp.hide();
        return this;
    }
}

export default ProgressAjax;