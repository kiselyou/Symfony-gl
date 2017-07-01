
const Configuration = require('./Configuration');
const Security = require('./security/Security');
const Connect = require('./db/Connect');
const View = require('./view/View');
const Routes = require('./Routes');
const Error = require('./Error');

class Components extends Configuration {

    constructor() {
        super();

        /**
         *
         * @type {Error}
         */
        this.err = new Error();

        /**
         *
         * @type {Routes}
         */
        this.routes = new Routes(this);

        /**
         *
         * @type {View}
         */
        this.view = new View(this);

        /**
         *
         * @type {Security}
         */
        this.secur = new Security(this);

        /**
         *
         * @type {Connect}
         */
        this.db = new Connect(this);
    }
}

/**
 *
 * @module Components
 */
module.exports = Components;
