import View from './../View';
import IndicatorsItem from './IndicatorsItem';

import {
    VIEW_NAME_INDICATORS
} from './../../ini/ejs.ini';

let indicators = null;

class Indicators extends View {
    constructor() {
        super();

        this._viewName = VIEW_NAME_INDICATORS;

        /**
         *
         * @type {Array}
         * @private
         */
        this._options = [];
    }

    /**
     *
     * @returns {Indicators}
     */
    static get() {
        return indicators ? indicators : (indicators = new Indicators())
    }

    /**
     * Build indicators
     *
     * @returns {Indicators}
     */
    buildIndicators() {
        this.viewOptions = this._options;
        this
            .autoCleanContainer()
            .build(VIEW_NAME_INDICATORS);
        this.showIndicators();
        return this;
    }

    /**
     * Show block indicators
     *
     * @returns {Indicators}
     */
    showIndicators() {
        this.showView();
        return this;
    }

    /**
     * Show block indicators
     *
     * @returns {Indicators}
     */
    hideIndicators() {
        this.hideView();
        return this;
    }

    /**
     * Add indicator
     *
     * @param {string} icon - icon name
     * @param {function} [listener]
     * @returns {IndicatorsItem}
     */
    addIndicator(icon, listener = null) {
        let item = new IndicatorsItem(icon);
        !listener || item.addEvent(listener);
        this._options.push(item);
        return item;
    }

    removeIndicator(id) {

    }
}

export default Indicators;