
import passwordHash from 'password-hash';
const KEY_SESSION = 'security';

class Authorization {

    constructor() {

    }

    static getSessionData(req, value) {
        if (req && req.session) {
            return req.session.hasOwnProperty(KEY_SESSION) ? req.session[KEY_SESSION][value] : null;
        }
        return null;
    }

    /**
     *
     * @param {{}} req
     * @param {{}} user
     * @param {string} userRole
     * @returns void
     */
    createSessionUser(req, user, userRole) {
        req.session[KEY_SESSION] = {user: user, role: userRole};
    };

    /**
     *
     * @param req
     * @returns {?{}}
     */
    getSessionUser(req) {
        return Authorization.getSessionData(req, 'user');
    };

    /**
     *
     * @param req
     * @returns {?string}
     */
    getSessionRole(req) {
        return Authorization.getSessionData(req, 'role');
    }

    /**
     *
     * @param req
     * @returns void
     */
    destroySessionUser(req) {
        req.session.destroy();
    };

    /**
     *
     * @param {string} password
     * @returns {string}
     */
    hashPassword(password) {
        return passwordHash.generate(password);
    };

    /**
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {void}
     */
    comparePassword(password, hashedPassword) {
        return passwordHash.verify(password, hashedPassword);
    }
}

/**
 *
 * @module Authorization
 */
export default Authorization;
