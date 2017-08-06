const Repository = require('./../../core/Repository');

class IWRoles extends Repository {
    /**
     *
     * @param {Connection} db
     */
    constructor(db) {
        super(db);

        /**
         *
         * @type {string}
         */
        this.table = 'iw_roles';

        /**
         *
         * @type {?number}
         */
        this.id = null;

        /**
         *
         * @type {?number}
         */
        this.parent = null;

        /**
         *
         * @type {?string}
         */
        this.role = null;

        /**
         *
         * @type {?number}
         */
        this.by_default = null;

        /**
         *
         * @type {?string}
         */
        this.name = null;

        /**
         *
         * @type {number}
         */
        this.deleted = 0;

        /**
         *
         * @type {?number}
         */
        this.create_at = null;

        /**
         *
         * @type {number}
         */
        this.update_at = null;
    }
}

module.exports = IWRoles;
