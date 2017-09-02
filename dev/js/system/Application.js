
import Ajax from './Ajax';
import UIMessage from './ui/UIMessage';

/** Class representing a base functional. */
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
