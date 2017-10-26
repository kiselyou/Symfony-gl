import mongodb from 'mongodb';

class MongoDBConnect {
	/**
	 *
	 * @param {{host: string, port: number, user: string, password: string, database: string}} config
	 */
	constructor(config) {
		/**
		 *
		 * @type {{host: string, port: number, user: string, password: string, database: string}}
		 * @private
		 */
		this._conf = config;

		/**
		 *
		 * @type {?Db}
		 */
		this.dbm = null;

		/**
		 *
		 */
		this._ObjectID = mongodb.ObjectID;

		/**
		 *
		 * @type {string}
		 */
		this._url = 'mongodb://' + this._conf.host + ':' + this._conf.port + '/' + this._conf.database;
	}

	/**
	 *
	 * @param {string} str
	 * @returns {ObjectID}
	 */
	getObjectID(str) {
		return new this._ObjectID(str);
	}

	/**
	 * @param {?Object} error
	 * @param {Db} db
	 * @callback openConnection
	 */

	/**
	 *
	 * @param {openConnection} listener
	 * @returns {MongoDBConnect}
	 */
	open(listener) {
		mongodb.MongoClient.connect(this._url, (error, db) => {
			if (error) {
				console.log('MongoDB: Can not set connection', error);
				return;
			}
			this.dbm = db;
			listener(db);
		});
		return this;
	}
}

export default MongoDBConnect;