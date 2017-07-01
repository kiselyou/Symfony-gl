
const mysql = require('mysql');
const mysqlUtilities = require('mysql-utilities');

class Connect {
    /**
     *
     * @param {Components} config
     */
    constructor(config) {
        /**
         *
         * @type {Components}
         * @private
         */
        this._config = config;

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
                this._db(this._config.mySQL);
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
