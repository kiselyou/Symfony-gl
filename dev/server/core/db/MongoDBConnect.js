import mongodb from 'mongodb';

class MongoDBConnect {
	/**
	 *
	 * @param {string} url
	 */
	constructor(url) {
		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._url = url;
	}

	/**
	 *
	 * @param {string} str
	 * @returns {ObjectID}
	 */
	getObjectID(str) {
		return new mongodb.ObjectID(str);
	}

	/**
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
				console.log('MongoDB connection is not correct', error);
				return;
			}
			listener(db);
		});
		return this;
	}
}

export default MongoDBConnect;