
import Ajax from './Ajax';
import Lock from './Lock';
import View from './View';

class Application {
    constructor() {
        console.log('Application');

        /**
         *
         * @type {Ajax}
         */
        this.ajax = new Ajax();

        /**
         *
         * @type {Lock}
         */
        this.lock = new Lock();

        /**
         *
         * @type {View}
         */
        this.view = new View();
    }
}

export default Application;
