
import passwordHash from 'password-hash';

class Authorization {

    /**
     *
     * @param {Session} session
     */
    constructor(session) {

        /**
         *
         * @type {passwordHash}
         */
        this._passwordHash = passwordHash;

        /**
         *
         * @type {Session}
         */
        this._session = session;
    }

    /**
     * Get session
     *
     * @returns {Session}
     */
    get session() {
        return this._session;
    }

    /**
     * Create session of user
     *
     * @param {(string|number)} id
     * @param {string} roles
     * @param {Object} [info]
     * @returns {Authorization}
     */
    createSessionUser(id, roles, info = {}) {
        info['roles'] = roles;
        this._session.setSessionUser(id, info);
        return this;
    };

    /**
     * Get session of user
     *
     * @returns {Object}
     */
    getSessionUser() {
        return this._session.getSessionUser();
    };


    /**
     * Get roles of user
     *
     * @returns {Array}
     */
    getSessionUserRoles() {
        let user = this._session.getSessionUser();
        return user ? user['roles'] : ['ROLE_ANONYMOUSLY'];
    };

    /**
     *
     * @param {string} password
     * @returns {string}
     */
    hashPassword(password) {
        return this._passwordHash.generate(password);
    };

    /**
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {boolean}
     */
    comparePassword(password, hashedPassword) {
        return this._passwordHash.verify(password, hashedPassword);
    }
}

/**
 *
 * @module Authorization
 */
export default Authorization;
