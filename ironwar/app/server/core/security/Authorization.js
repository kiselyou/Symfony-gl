'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _passwordHash = require('password-hash');

var _passwordHash2 = _interopRequireDefault(_passwordHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEY_SESSION = 'security';

var Authorization = function () {
    function Authorization() {
        _classCallCheck(this, Authorization);
    }

    _createClass(Authorization, [{
        key: 'createSessionUser',


        /**
         *
         * @param {{}} req
         * @param {{}} user
         * @param {string} userRole
         * @returns void
         */
        value: function createSessionUser(req, user, userRole) {
            req.session[KEY_SESSION] = { user: user, role: userRole };
        }
    }, {
        key: 'getSessionUser',


        /**
         *
         * @param req
         * @returns {?{}}
         */
        value: function getSessionUser(req) {
            return Authorization.getSessionData(req, 'user');
        }
    }, {
        key: 'getSessionRole',


        /**
         *
         * @param req
         * @returns {?string}
         */
        value: function getSessionRole(req) {
            return Authorization.getSessionData(req, 'role');
        }

        /**
         *
         * @param req
         * @returns void
         */

    }, {
        key: 'destroySessionUser',
        value: function destroySessionUser(req) {
            req.session.destroy();
        }
    }, {
        key: 'hashPassword',


        /**
         *
         * @param {string} password
         * @returns {string}
         */
        value: function hashPassword(password) {
            return _passwordHash2.default.generate(password);
        }
    }, {
        key: 'comparePassword',


        /**
         *
         * @param {string} password
         * @param {string} hashedPassword
         * @returns {void}
         */
        value: function comparePassword(password, hashedPassword) {
            return _passwordHash2.default.verify(password, hashedPassword);
        }
    }], [{
        key: 'getSessionData',
        value: function getSessionData(req, value) {
            if (req && req.session) {
                return req.session.hasOwnProperty(KEY_SESSION) ? req.session[KEY_SESSION][value] : null;
            }
            return null;
        }
    }]);

    return Authorization;
}();

/**
 *
 * @module Authorization
 */


exports.default = Authorization;