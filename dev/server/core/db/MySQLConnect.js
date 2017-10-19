
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

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isOpened = false;
    }

    /**
     *
     * @returns {?Connection}
     */
    open() {
    	if (this._isOpened) {
			return this.connection;
		}
        this.connection = mysql.createConnection(this._conf);
        this.connection.connect();
        mysqlUtilities.upgrade(this.connection);
        mysqlUtilities.introspection(this.connection);
		this._isOpened = true;
        return this.connection;
    }

    /**
     *
     * @returns {MySQLConnect}
     */
    close() {
		if (this._isOpened) {
        	this.connection.end();
			this._isOpened = false;
		}
        return this;
    }
}

export default MySQLConnect;
