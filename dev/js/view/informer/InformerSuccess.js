import View from '../../system/View';

class InformerSuccess extends View {
    /**
     *
     * @param {string} path - It is path to template
     */
    constructor(path) {
        super(path);
    }

    /**
     * Paste view success to the block
     *
     * @param {UIElement|Element|string} blockElement - String is selector
     * @param {Array|string} messages - It is messages. Can be string
     * @param {boolean} autoClean - default is true
     * @returns {InformerSuccess}
     */
    pasteTo(blockElement, messages, autoClean = true) {
        this.viewParams = {messages: (typeof messages === 'string') ? [messages] : messages};
        this
            .autoCleanElement(autoClean)
            .updateContainer(blockElement)
            .upload(() => {
                this.show();
            });
    }
}

export default InformerSuccess;