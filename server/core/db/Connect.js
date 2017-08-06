
const mysql = require('mysql');
const mysqlUtilities = require('mysql-utilities');

class Connect {
    /**
     *
     * @param {Conf} config
     */
    constructor(config) {
        /**
         *
         * @type {Conf}
         * @private
         */
        this._conf = config;

        /**
         *
         * @type {null}
         */
        this.connection = null;
    }

    /**
     *
     * @param {string} [type]
     * @returns {null|Connection|*}
     */
    open(type) {
        switch (type) {
            case 'mysql':
            default:
                this._db(this._conf.mySQL);
                break;
        }
        return this.connection;
    }

    /**
     *
     * @private
     */
    _db(param) {
        this.connection = mysql.createConnection(param);
        this.connection.connect();
        mysqlUtilities.upgrade(this.connection);
        mysqlUtilities.introspection(this.connection);
    }

    /**
     *
     * @returns {Connect}
     */
    close() {
        this.connection.end();
        return this;
    }
}

module.exports = Connect;
