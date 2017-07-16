
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

        this.ajax.post('/template', {s: 0, ddd: 32412312, fff: {s: 13}})
            .then(
                (sss) => {
                    console.log(sss, '++');
                },
                (a, b) => {
                    console.log(a, b, '---');
                }
            );

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
