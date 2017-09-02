import Lock from './Lock';
import Ajax from './Ajax';
import UIMessage from './ui/UIMessage';

class Application {
    constructor() {
        this.lock = new Lock();

        this.lock.isLocked((status) => {
            console.log(status);
        });

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
