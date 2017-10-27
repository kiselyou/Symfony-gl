
import passwordHash from 'password-hash';
import Session from "./Session";

class Authorization extends Session {
	/**
	 *
	 * @param {?Object} session
	 */
    constructor(session) {
		super(session);

        /**
         *
         * @type {passwordHash}
         */
        this._passwordHash = passwordHash;
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
        this.setSessionUser(id, info);
        return this;
    };


    /**
     * Get roles of user
     *
     * @returns {Array}
     */
    getSessionUserRoles() {
        let user = this.getSessionUser();
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
