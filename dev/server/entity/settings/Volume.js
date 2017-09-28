
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
     * @param {number} id - This is user ID
     * @param {completedQuery} completedQuery
     */
    getUserSettingVolume(id, completedQuery) {
        let sql = `
            SELECT id,
                   menu,
                   tab,
                   effects,
                   environment,
                   turn_on
              FROM iw_volume 
             WHERE user_id = ?
        `;
        this._db.queryRow(sql, [id], completedQuery);
    }
}

export default Volume;