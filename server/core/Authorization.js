const bcrypt = require('bcrypt');
const KEY_SESSION = 'user';

class Authorization {

    constructor() {
        this._roundsSalt = 10;
    }

    /**
     *
     * @param {{}} req
     * @param {{}} userData
     * @returns void
     */
    createSessionUser(req, userData) {
        req.session[KEY_SESSION] = userData;
    };

    /**
     *
     * @param req
     * @returns {{}|null}
     */
    getSessionUser(req) {
        return req.session.hasOwnProperty(KEY_SESSION) ? req.session[KEY_SESSION] : null;
    };

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
     * @param password
     * @param {requestCallback} requestCallback
     * @callback requestCallback - The callback that handles the response.
     */
    cryptPassword(password, requestCallback) {
        bcrypt.genSalt(this._roundsSalt, function(err, salt) {
            if (err) {
                return requestCallback(err, null);
            }

            bcrypt.hash(password, salt, function(err, hash) {
                return requestCallback(err, hash);
            });

        });
    };

    /**
     *
     * @param {string} password
     * @param {string} hashPassword
     * @param {requestCallback} requestCallback
     * @callback requestCallback
     */
    comparePassword(password, hashPassword, requestCallback) {
        bcrypt.compare(password, hashPassword, function(err, isPasswordMatch) {
            if (err) {
                return requestCallback(err, null);
            }
            return requestCallback(null, isPasswordMatch);
        });
    };
}

/**
 *
 * @module Authorization
 */
module.exports = Authorization;
