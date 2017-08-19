import Lock from './Lock';
import Ajax from './Ajax';
import UIMessage from './ui/UIMessage';

class Application {
    constructor() {
        this.lock = new Lock();

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
