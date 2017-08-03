
import passwordHash from 'password-hash';
const KEY_SESSION = 'KEY_USER_SESSION';

class Authorization {

    /**
     *
     * @param {Server} server
     */
    constructor(server) {

        /**
         *
         * @type {Server}
         * @private
         */
        this._server = server;

        /**
         *
         */
        this._passwordHash = passwordHash;
    }

    /**
     *
     * @param {Object} user
     * @param {string} role
     * @returns void
     */
    createSessionUser(user, role) {
        let session = {};
        session[KEY_SESSION] = {user: user, role: role};
        this._server.setSession(session);
    };

    /**
     *
     * @returns {Object}
     */
    getUser() {
        return this._server.getSession(KEY_SESSION);
    };


    /**
     *
     * @returns {string}
     */
    getUserRole() {
        let user = this._server.getSession(KEY_SESSION);
        return user.hasOwnProperty('role') ? user['role'] : 'ROLE_ANONYMOUSLY';
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
