
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


        // this.ajax.get('/templatess/10', {s: 0, ddd: 32412312, fff: {s: 13}, dddddd: [1, 2, 3]})
        //     .then(
        //         (sss) => {
        //             console.log(JSON.parse(sss), '++');
        //         },
        //         (a, b) => {
        //             console.log(a, b, '---');
        //         }
        //     );

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
