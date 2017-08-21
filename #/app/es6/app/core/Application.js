
import Ajax from './Ajax';
import Lock from './Lock';
import Error from './Error';
import ejs from 'ejs';

import fs from 'fs';

// import templateError from './../view/error.ejs';

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

        this.ejs = ejs;

        /**
         *
         *
         *
         * @type {Error}
         */
        this.error = new Error()
    }
}

export default Application;
