const QueryBuilder = require('./QueryBuilder');

class Repository {
    /**
     *
     * @param {Connection} db
     */
    constructor(db) {

        /**
         * @type {Connection}
         */
        this.db = db;

        /**
         *
         * @type {?string}
         */
        this.table = null;
    }

    /**
     *
     * @param {Error}
     * @callback errorQuery
     */

    /**
     *
     * @param {Array}
     * @callback findSuccess
     */

    /**
     *
     * @param {?*}
     * @callback findByOneSuccess
     */

    /**
     *
     * @param {number} id
     * @param {errorQuery} onError
     * @param {findByOneSuccess} onSuccess
     * @param {!(string|Array)} [fields]
     * @returns {void}
     */
    findById(id, onError, onSuccess, fields = '*') {
        let builder = new QueryBuilder(this.table, fields, {id: id});
        this.db.queryRow(builder.sql, builder.params, (error, row) => {
            if (error) {
                onError(error);
                return false;
            }

            if (row) {
                this.fields = row;
                onSuccess(this);
            } else {
                onSuccess(null);
            }
        });
    }

    /**
     *
     * @param {errorQuery} onError
     * @param {findByOneSuccess} onSuccess
     * @param {!(string|Object|Array)} [where]
     * @param {!(string|Array)} [fields]
     * @returns {void}
     */
    findByOne(onError, onSuccess, where = '', fields = '*') {
        let builder = new QueryBuilder(this.table, fields, where);
        this.db.queryRow(builder.sql, builder.params, (error, row) => {
            if (error) {
                onError(error);
                return false;
            }

            if (row) {
                this.fields = row;
                onSuccess(this);
            } else {
                onSuccess(null);
            }
        });
    }

    /**
     *
     * @param {errorQuery} onError
     * @param {findSuccess} onSuccess
     * @param {!(string|Object|Array)} [where]
     * @param {!(string|Array)} [fields]
     * @param {!(string|Object|Array)} [orderBy]
     * @returns {void}
     */
    find(onError, onSuccess, where = {}, fields = '*', orderBy = '') {
        let builder = new QueryBuilder(this.table, fields, where, orderBy);

        this.db.query(builder.sql, builder.params, (err, rows) => {
            if (err) {
                onError(err);
                return false;
            }

            let arr = [];

            if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    if (i === 0) {
                        this.fields = rows[i];
                        arr.push(this);
                    } else {
                        let copyObj = Object.assign({}, this);
                        copyObj.fields = rows[i];
                        arr.push(copyObj);
                    }
                }
            }

            onSuccess(arr);
        });
    }

    /**
     *
     * @param {errorQuery} onError
     * @param {findSuccess} onSuccess
     * @param {!(Object)} fields
     * @param {!(Object)} [where]
     * @returns {void}
     */
    update(onError, onSuccess, fields, where) {
        this.db.update(this.table, fields, where, (err, rows) => {
            if (err) {
                onError(err);
                return;
            }
            onSuccess(rows);
        });
    }

    /**
     *
     * @param {errorQuery} onError
     * @param {findSuccess} onSuccess
     * @param {!(Object)} data
     * @returns {void}
     */
    insert(onError, onSuccess, data) {
        this.db.insert(this.table, data, (err, recordID) => {
            if (err) {
                onError(err);
                return;
            }
            onSuccess(recordID);
        });
    }

    /**
     * Set value of fields in the Entity
     *
     * @param {{}} data
     * @returns {void}
     */
    set fields(data) {
        for (let field in data) {
            if (data.hasOwnProperty(field) && this.hasOwnProperty(field)) {
                this[field] = data[field];
            }
        }
    }
}

module.exports = Repository;
