
import Ajax from './Ajax';
import UIMessage from './ui/UIMessage';

class Application {
    constructor() {

        /**
         *
         * @type {Ajax}
         */
        this.ajax = new Ajax();

        /**
         *
         * @type {UIMessage}
         */
        this.msg = new UIMessage();
    }
}

export default Application;
