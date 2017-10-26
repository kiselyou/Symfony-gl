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
				console.log('MongoDB: Can not set connect', error);
				return;
			}

			this.dbm = db;

			// db.collection('test_scheme').insert({a:1}, (err, res) => {
			// 	// console.log(err, res);
			// });
			//
			// db.collection('test_scheme').findOne({a:1}, (err, item) => {
			// 	console.log(err, item);
			// });

			// const details = { '_id': this.getObjectID('59f246b4ada98917af7121fc') };
			// db.collection('test_scheme').remove(details, (err, item) => {
			// 	console.log(err, item);
			// });


			// const details = { '_id': this.getObjectID('59f246d35ba2f817dee27abd') };
			// const note = { a: 23232 };
			// db.collection('notes').update(details, note, (err, result) => {
			// 	console.log(err, result);
			// });

			listener(db);
		});
		return this;
	}
}

export default MongoDBConnect;