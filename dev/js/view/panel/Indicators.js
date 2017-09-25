import View from './../View';
import IndicatorsItem from './IndicatorsItem';

import {
    VIEW_NAME_INDICATORS
} from './../../ini/ejs.ini';

class Indicators extends View {

    constructor() {
        super();

        this._viewName = VIEW_NAME_INDICATORS;

        /**
         *
         * @type {Array.<IndicatorsItem>}
         * @private
         */
        this._options = [];
    }

    /**
     * Build indicators
     *
     * @param {Element|UIElement|string} [container]
     * @returns {Indicators}
     */
    buildIndicators(container) {
        this.updateContainer(container);
        this.viewOptions = this._options;
        this
            .autoCleanContainer()
            .build(VIEW_NAME_INDICATORS);
        this.showIndicators();
        this._initEvents();
        return this;
    }

    /**
     *
     * @private
     */
    _initEvents() {
        for (let item of this._options) {
            this.getViewAction(item.id).addEvent('click', () => {
                for (let listener of item.events) {
                    listener();
                }
            });
        }
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

    /**
     * Sort Items
     *
     * @param {string} [type] - 'ASC' | 'DESC'
     * @returns {Indicators}
     */
    sortItems(type = 'ASC') {
        this._options.sort(function(a, b) {
            return type === 'ASC' ? a['order'] - b['order'] : b['order'] - a['order'];
        });
        return this;
    }

    removeIndicator(id) {

    }
}

export default Indicators;