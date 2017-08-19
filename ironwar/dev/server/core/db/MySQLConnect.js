
import mysql from 'mysql';
import mysqlUtilities from 'mysql-utilities';

class MySQLConnect {
    /**
     *
     * @param {Conf} config
     */
    constructor(config) {
        /**
         *
         * @type {{host: string, port: number, user: string, password: string, database: string}}
         * @private
         */
        this._conf = config.mysql;

        /**
         *
         * @type {?Connection}
         */
        this.connection = null;
    }

    /**
     *
     * @returns {?Connection}
     */
    open() {
        this.connection = mysql.createConnection(this._conf);
        this.connection.connect();
        mysqlUtilities.upgrade(this.connection);
        mysqlUtilities.introspection(this.connection);
        return this.connection;
    }

    /**
     *
     * @returns {MySQLConnect}
     */
    close() {
        this.connection.end();
        return this;
    }
}

export default MySQLConnect;
