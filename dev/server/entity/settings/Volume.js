
class Volume {
    /**
     *
     * @param {Connection} db
     * @param {EntityCollection} [collection]
     */
    constructor(db, collection) {
        /**
         *
         * @type {Connection}
         * @private
         */
        this._db = db;

        /**
         *
         * @type {EntityCollection}
         * @private
         */
        this._collection = collection;
    }

    /**
     * Get setting of user
     *
     * @param {number} user_id - This is user ID
     * @param {completedQuery} completedQuery
     */
    getSetting(user_id, completedQuery) {
        let sql = `
            SELECT id,
                   menu,
                   tab,
                   effect,
                   environment,
                   turn_on
              FROM iw_volume 
             WHERE user_id = ?
        `;
        this._db.queryRow(sql, [user_id], completedQuery);
    }

    /**
     * @param {?string} error
     * @param {?Object} data
     * @callback completedQuery
     */

    /**
     * @param {?string} error
     * @param {?number} recordId
     * @callback completedInsert
     */

    /**
     * @param {?string} error
     * @param {?number} affectedRows
     * @callback completedUpdate
     */

    /**
     * @param {?string} error
     * @param {?number} recordId
     * @param {number} actionName - possible values (1 - insert, 2 - update, 0 - check error)
     * @callback completedUpdateOrInsert
     */

    /**
     *
     * @param {Object} data
     * @param {number} user_id
     * @param {completedUpdateOrInsert} listener
     * @returns {void}
     */
    updateOrInsert(data, user_id, listener) {
        this.getSetting(user_id, (error, row) => {
            if (error) {
                listener(error, null, 0);
                return;
            }
            if (!row) {
                data['user_id'] = user_id;
                this._db.insert('iw_volume', data, (error, recordId) => {
                    listener(error, recordId, 1);
                });
            } else {
                this._db.update('iw_volume', data, {user_id: user_id}, (error) => {
                    listener(error, row['id'], 2);
                });
            }
        });
    }
}

export default Volume;