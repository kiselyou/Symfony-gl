const Repository = require('./../../core/Repository');

class IWUsers extends Repository {

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
        this.table = 'iw_users';

        /**
         *
         * @type {number}
         */
        this.id = null;

        /**
         *
         * @type {?string}
         */
        this.username = null;

        /**
         *
         * @type {?string}
         */
        this.password = null;

        /**
         *
         * @type {?string}
         */
        this.email = null;

        /**
         *
         * @type {number}
         */
        this.is_active = 1;

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

        /**
         *
         * @type {?string}
         */
        this.uuid = null;

        /**
         *
         * @type {Array}
         */
        this.roles = [];
    }
}

module.exports = IWUsers;
