
const mysql = require('mysql');
const mysqlUtilities = require('mysql-utilities');

class Connect {
    /**
     *
     * @param {{ mysql: { host: string, port: (number|null), user: string, password: string, database: string } }} config
     */
    constructor(config) {
        /**
         *
         * @type {{ mysql: { host: string, port: (number|null), user: string, password: string, database: string } }}
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
                this._db(this._config['mysql']);
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
