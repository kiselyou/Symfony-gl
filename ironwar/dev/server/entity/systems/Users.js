
class Users {
    /**
     *
     * @param {Connection} db
     */
    constructor(db) {
        /**
         *
         * @type {Connection}
         * @private
         */
        this._db = db;
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
                   password
              FROM iw_users 
             WHERE username = ?
               AND deleted = 0
        `;
        this._db.queryRow(sql, [name], completedQuery);
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
     * @param completedInsert
     */
    insertRecord(data, completedInsert) {
        this._db.insert('iw_users', data, completedInsert);
    }
}

export default Users;
