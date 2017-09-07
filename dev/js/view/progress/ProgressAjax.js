import ViewBuffer from './../ViewBuffer';
import UIElement from './../../system/ui/UIElement';
import {VIEW_NAME_PROGRESS_AJAX} from './../view-path';

let progressAjax = null;

class ProgressAjax {
    constructor() {

        this._viewBuffer = new ViewBuffer();

        /**
         * It is empty element which will have template
         *
         * @type {UIElement}
         */
        this.el = this._viewBuffer.find(VIEW_NAME_PROGRESS_AJAX);

        /**
         * It is element which will have templates
         *
         * @type {UIElement}
         */
        this.container = new UIElement('body');
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
     */
    start() {
        this.el.show();
        this.container.afterBegin(this.el);
        return this;
    }

    stop() {
        this.el.hide();
        // this.container.removeChild(this.el);
    }
}

export default ProgressAjax;