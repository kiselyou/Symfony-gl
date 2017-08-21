
class Roles {
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
     * Find default Role
     *
     * @param {completedQuery} completedQuery
     */
    findDefaultRole(completedQuery) {
        let sql = `
            SELECT id,
                   role
              FROM iw_roles 
             WHERE by_default = 1
               AND deleted = 0
        `;
        this._db.queryRow(sql, [], completedQuery);
    }

    /**
     * Find default Role
     *
     * @param {number} userID
     * @param {completedQuery} completedQuery
     */
    findUserRoles(userID, completedQuery) {
        let sql = `
           SELECT r.id,
                  r.role
             FROM iw_roles AS r
				  INNER JOIN iw_users_roles AS rh ON rh.role_id = r.id
            WHERE r.deleted = 0
			  AND rh.user_id = ?;
        `;
        this._db.query(sql, [userID], completedQuery);
    }

    /**
     * @param {?string} error
     * @param {?number} recordId
     * @callback completedInsert
     */

    /**
     * Create relationship
     *
     * @param {Object} data
     * @param completedInsert
     */
    insertRelationship(data, completedInsert) {
        this._db.insert('iw_users_roles', data, completedInsert);
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
    deleteRelationship(where, completedDelete) {
        this._db.delete('iw_users_roles', where, completedDelete);
    }
}

export default Roles;
