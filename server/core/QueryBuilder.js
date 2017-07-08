
class QueryBuilder {

    /**
     *
     * @param {?string} table
     * @param {!(string|Array|Object)} [field]
     * @param {!(string|Array|Object)} [where]
     * @param {!(string|Array|Object)} [orderBy]
     */
    constructor(table, field = '*', where = '', orderBy = '') {
        /**
         *
         * @type {string}
         * @private
         */
        this._table = table;

        /**
         *
         * @type {string|Array|Object}
         * @private
         */
        this._field = field;

        /**
         *
         * @type {string|Array|Object}
         * @private
         */
        this._where = where;

        /**
         *
         * @type {string|Array|Object}
         * @private
         */
        this._orderBy = orderBy;

        /**
         *
         * @type {Array}
         * @private
         */
        this._params = [];
    }

    /**
     *
     * @param value
     */
    _addParams(value) {
        this._params.push(value);
    }

    /**
     *
     * @returns {Array}
     */
    get params() {
        return this._params;
    }

    /**
     * Clean params
     *
     * @returns {QueryBuilder}
     */
    _cleanParams() {
        this._params = [];
        return this;
    }

    /**
     *
     * @returns {string}
     */
    get where() {
        let arr = [];
        this._cleanParams();
        if (this._where instanceof Array) {
            for(let item of this._where) {
                let operator = '=';
                switch (item['operator']) {
                    case '=':
                        arr.push(item['field'] + ' = ?');
                        this._addParams(item['value']);
                        break;
                    case '<=>':
                        arr.push(item['field'] + ' <=> ?');
                        this._addParams(item['value']);
                        break;
                    case '!=':
                    case '<>':
                        arr.push(item['field'] + ' != ?');
                        this._addParams(item['value']);
                        break;
                    case '<':
                        arr.push(item['field'] + ' < ?');
                        this._addParams(item['value']);
                        break;
                    case '>':
                        arr.push(item['field'] + ' > ?');
                        this._addParams(item['value']);
                        break;
                    case '>=':
                        arr.push(item['field'] + ' >= ?');
                        this._addParams(item['value']);
                        break;
                    case '<=':
                        arr.push(item['field'] + ' <= ?');
                        this._addParams(item['value']);
                        break;
                    case 'BETWEEN':
                    case 'between':
                        arr.push(item['field'] + ' BETWEEN ? AND ?');
                        this._addParams(item['value']);
                        this._addParams(item['valueTo']);
                        break;
                    case 'NOT BETWEEN':
                    case 'not between':
                        arr.push(item['field'] + ' NOT BETWEEN ? AND ?');
                        this._addParams(item['value']);
                        this._addParams(item['valueTo']);
                        break;
                    case 'IN':
                    case 'in':
                        arr.push(item['field'] + ' IN (?)');
                        this._addParams((item['value'] instanceof Array) ? item['value'].join(',') : item['value']);
                        break;
                    case 'NOT IN':
                    case 'not in':
                        arr.push(item['field'] + ' NOT IN (?)');
                        this._addParams((item['value'] instanceof Array) ? item['value'].join(',') : item['value']);
                        break;
                        break;
                    case 'IS':
                    case 'is':
                        switch (item['field']) {
                            case true:
                                arr.push(item['field'] + ' IS (TRUE)');
                                break;
                            case false:
                                arr.push(item['field'] + ' IS (FALSE)');
                                break;
                            case null:
                                arr.push(item['field'] + ' IS (UNKNOWN)');
                                break;
                            default:
                                arr.push(item['field'] + ' IS (?)');
                                this._addParams(item['value']);
                        }
                        break;
                    case 'IS NOT':
                    case 'is not':
                        switch (item['field']) {
                            case true:
                                arr.push(item['field'] + ' IS NOT (TRUE)');
                                break;
                            case false:
                                arr.push(item['field'] + ' IS NOT (FALSE)');
                                break;
                            case null:
                                arr.push(item['field'] + ' IS NOT (UNKNOWN)');
                                break;
                            default:
                                arr.push(item['field'] + ' IS NOT (?)');
                                this._addParams(item['value']);
                        }
                        break;
                    case 'IS NOT NULL':
                    case 'is not null':
                        arr.push(item['field'] + ' IS NOT NULL');
                        break;
                    case 'IS NULL':
                    case 'is null':
                        arr.push(item['field'] + ' IS NULL');
                        break;
                    case 'LIKE':
                    case 'like':
                        arr.push(item['field'] + ' LIKE %?%');
                        this._addParams(item['value']);
                        break;
                    case 'NOT LIKE':
                    case 'not like':
                        arr.push(item['field'] + ' NOT LIKE %?%');
                        this._addParams(item['value']);
                        break;
                }
            }
        } else if (this._where instanceof Object) {
            for (let field in this._where) {
                if (this._where.hasOwnProperty(field)) {
                    arr.push(field + ' = ? ');
                    this._addParams(this._where[field]);
                }
            }
        } else {
            if (this._where !== '') {
                arr.push(this._where);
            }
        }

        return arr.length === 0 ? '' : (' WHERE ' + arr.join(' AND '));
    }

    /**
     *
     * @returns {string}
     */
    get select() {
        let fields = null;
        if (this._field instanceof Array) {
            fields = this._field.join(',');
        } if (this._field instanceof Object) {
            let arr = [];
            for (let field in this._field) {
                if (this._field.hasOwnProperty(field)) {
                    let alias = (typeof this._field[field] === 'string' && this._field[field] !== '') ? ' as ' + this._field[field] : '';
                    arr.push(field + alias);
                }
            }
            fields = arr.join(',');
        } else {
            fields = this._field
        }
        return 'SELECT ' + fields + (this._table ? ' FROM ' + this._table : '');
    }

    // /**
    //  *
    //  * @returns {string}
    //  */
    // get sqlUpdate() {
    //     let fields = null;
    //     this._cleanParams();
    //     if (this._field instanceof Object) {
    //         let arr = [];
    //         for (let field in this._field) {
    //             if (this._field.hasOwnProperty(field)) {
    //                 arr.push(field + ' = ? ');
    //                 this._addParams(this._field[field]);
    //             }
    //         }
    //         fields = arr.join(',');
    //     } else {
    //         fields = this._field
    //     }
    //
    //     return 'UPDATE ' + this._table + ' SET ' + fields + this.where;
    // }

    /**
     *
     * @returns {string}
     */
    get orderBy() {
        let str = '';
        if (this._orderBy instanceof Array) {
            str = this._orderBy.join(',');
        } if (this._orderBy instanceof Object) {
            let arr = [];
            for (let field in this._orderBy) {
                if (this._orderBy.hasOwnProperty(field)) {
                    let order = '';
                    switch (this._orderBy[field]) {
                        case 'ASC':
                            order = ' ASC';
                            break;
                        case 'DESC':
                            order = ' DESC';
                            break;
                    }
                    arr.push(field + order);
                }
            }
            str = arr.join(',');
        } else {
            str = this._orderBy;
        }

        return str === '' ? '' : (' ORDER BY ' + str);
    }

    /**
     *
     * @returns {string}
     */
    get sql() {
        return this.select + this.where + this.orderBy;
    }
}

module.exports = QueryBuilder;
