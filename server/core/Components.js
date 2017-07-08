const uuidv4 = require('uuid/v4');
const Conf = require('./Conf');
const Security = require('./security/Security');
const Authorization = require('./security/Authorization.js');
const Connect = require('./db/Connect');
const Mailer = require('./Mailer');
const View = require('./view/View');
const Routes = require('./Routes');
const Error = require('./Error');

class Components {

    constructor() {

        /**
         *
         * @type {Conf}
         */
        this.conf = new Conf();

        /**
         *
         * @type {Error}
         */
        this.err = new Error();

        /**
         *
         * @type {Routes}
         */
        this.routes = new Routes(this.conf);

        /**
         *
         * @type {Authorization}
         */
        this.auth = new Authorization(this.conf);

        /**
         *
         * @type {View}
         */
        this.view = new View(this.conf, this.routes);



        /**
         *
         * @type {Security}
         */
        this.secur = new Security(this.conf);

        /**
         *
         * @type {Connect}
         */
        this.db = new Connect(this.conf);

        /**
         *
         * @type {Mailer}
         */
        this.mailer = new Mailer(this.conf);

        /**
         *
         * @type {function}
         */
        this.uuid = uuidv4;
    }
}

/**
 *
 * @module Components
 */
module.exports = Components;
