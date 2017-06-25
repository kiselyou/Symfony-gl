var bcrypt = require('bcrypt');

var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Authorization = function () {

};

IW.Security.prototype._roundsSalt = 10;

/**
 *
 * @param request
 * @param {{}} userData
 * @private
 * @returns void
 */
IW.Security.prototype.createSessionUser = function (request, userData) {
    request.session[IW.Security.KEY_SESSION] = userData;
};

/**
 *
 * @param request
 * @private
 * @returns {{}|null}
 */
IW.Security.prototype.getSessionUser = function (request) {
    return request.session.hasOwnProperty(IW.Security.KEY_SESSION) ? request.session[IW.Security.KEY_SESSION] : null;
};

/**
 *
 * @param request
 * @private
 * @returns void
 */
IW.Security.prototype.destroySessionUser = function (request) {
    request.session.destroy();
};

/**
 *
 * @param password
 * @param {requestCallback} requestCallback
 * @callback requestCallback - The callback that handles the response.
 */
IW.Security.prototype.cryptPassword = function(password, requestCallback) {
    var inst = this;
    inst._bcrypt.genSalt(inst._roundsSalt, function(err, salt) {
        if (err) {
            return requestCallback(err, null);
        }

        inst._bcrypt.hash(password, salt, function(err, hash) {
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
IW.Security.prototype.comparePassword = function(password, hashPassword, requestCallback) {
    bcrypt.compare(password, hashPassword, function(err, isPasswordMatch) {
        if (err) {
            return requestCallback(err, null);
        }
        return requestCallback(null, isPasswordMatch);
    });
};

IW.Security.KEY_SESSION = 'user';

/**
 *
 * @module Authorization
 */
module.exports = IW;
