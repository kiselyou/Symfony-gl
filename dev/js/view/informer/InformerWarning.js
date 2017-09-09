import View from '../../view/View';

const VIEW_BLOCK_HEADER = 'header';

class InformerWarning extends View {
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

        /**
         *
         * @type {boolean}
         */
        this.hideHeder = true;
    }

    /**
     * Paste warnings to the block
     *
     * @param {UIElement|Element|string} blockElement - String is selector
     * @param {Array|string} messages - It is messages. Can be string
     * @param {boolean} autoClean - default is true
     * @returns {InformerWarning}
     */
    pasteTo(blockElement, messages, autoClean = true) {
        this.viewOptions = {messages: (typeof messages === 'string') ? [messages] : messages};

        this
            .autoCleanElement(autoClean)
            .updateContainer(blockElement)
            .build(this._viewName)
            .show();

        this.getViewBlock(VIEW_BLOCK_HEADER).toggleShowOrHide(this.hideHeder);
    }
}

export default InformerWarning;
