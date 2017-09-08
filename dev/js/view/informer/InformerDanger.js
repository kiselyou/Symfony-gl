import View from '../../view/View';

class InformerDanger extends View {
    /**
     *
     * @param {string} viewName - It is template name
     */
    constructor(viewName) {
        super();

        /**
         * Template name
         *
         * @type {string}
         * @private
         */
        this._viewName = viewName;
    }

    /**
     * Paste view danger to the block
     *
     * @param {UIElement|Element|string} blockElement - String is selector
     * @param {Array|string} messages - It is messages. Can be string
     * @param {boolean} autoClean - default is true
     * @returns {InformerDanger}
     */
    pasteTo(blockElement, messages, autoClean = true) {
        this.viewOptions = {messages: (typeof messages === 'string') ? [messages] : messages};
        this
            .autoCleanElement(autoClean)
            .updateContainer(blockElement)
            .build(this._viewName)
            .show();
    }
}

export default InformerDanger;
