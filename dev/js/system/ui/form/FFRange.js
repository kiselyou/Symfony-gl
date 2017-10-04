import View from './../../../view/View';

import {
    VIEW_NAME_CUSTOM_RANGE
} from './../../../ini/ejs.ini';

class FFRange extends View {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {
        super(container);

        /**
         * Min value
         *
         * @type {number}
         * @private
         */
        this._min = 0;

        /**
         * Max value
         *
         * @type {number}
         * @private
         */
        this._max = 100;

        /**
         * Step to increase or reduce
         *
         * @type {number}
         * @private
         */
        this._step = 1;

        /**
         * Value
         *
         * @type {number}
         * @private
         */
        this._value = 0;
    }

    buildRange() {
        this
            .build(VIEW_NAME_CUSTOM_RANGE)
            .showView();
    }
}

export default FFRange;