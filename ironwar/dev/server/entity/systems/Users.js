
class Users {
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
     * @param {?string} error
     * @param {?{}} data
     * @callback completedQuery
     */

    /**
     * Find User by Name
     *
     * @param {string} name
     * @param {completedQuery} completedQuery
     */
    findByName(name, completedQuery) {
        let sql = `
            SELECT id,
                   is_active,
                   password
              FROM iw_users 
             WHERE username = ?
               AND deleted = 0
        `;
        this._db.queryRow(sql, [name], completedQuery);
    }

    /**
     * Find User by key of activation
     *
     * @param {string} activeCode It is key of activation
     * @param {completedQuery} completedQuery
     */
    findNotActive(activeCode, completedQuery) {
        let sql = `
            SELECT id,
                   username,
                   password
              FROM iw_users 
             WHERE uuid = ? 
               AND uuid IS NOT NULL
               AND deleted = 0
        `;

        this._db.queryRow(sql, [activeCode], completedQuery);
    }

    /**
     * @param {?string} error
     * @param {?number} recordId
     * @callback completedInsert
     */

    /**
     * Create record
     *
     * @param {Object} data
     * @param {completedInsert} completedInsert
     */
    insertRecord(data, completedInsert) {
        this._db.insert('iw_users', data, completedInsert);
    }

    /**
     * @param {?string} error
     * @param {?number} affectedRows
     * @callback completedUpdate
     */

    /**
     * Update record
     *
     * @param {Object} data
     * @param {Object} where
     * @param {completedUpdate} completedUpdate
     */
    updateRecord(data, where, completedUpdate) {
        this._db.update('iw_users', data, where, completedUpdate);
    }

    /**
     * @param {?string} error
     * @param {?number} affectedRows
     * @callback completedDelete
     */

    /**
     *
     * @param {Object} where
     * @param {completedDelete} [completedDelete]
     */
    deleteRecord(where, completedDelete) {
        this._db.delete('iw_users', where, completedDelete);
    }
}

export default Users;
