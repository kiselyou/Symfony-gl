
import passwordHash from 'password-hash';
import SessionControls from './../SessionControls';

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

        /**
         *
         * @type {SessionControls}
         */
        this.sessionControls = new SessionControls(this._req);
    }

    /**
     * Create session of user
     *
     * @param {(string|number)} id
     * @param {string} role
     * @param {Object} [info]
     * @returns {Authorization}
     */
    createSessionUser(id, role, info = {}) {
        info['role'] = role;
        this.sessionControls.setSessionUser(id, info);
        return this;
    };

    /**
     * Get session of user
     *
     * @returns {Object}
     */
    getSessionUser() {
        return this.sessionControls.getSessionUser();
    };


    /**
     * Get role of user
     *
     * @returns {string}
     */
    getSessionUserRole() {
        let user = this.sessionControls.getSessionUser();
        return user ? user['role'] : 'ROLE_ANONYMOUSLY';
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
