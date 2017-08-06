'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _passwordHash = require('password-hash');

var _passwordHash2 = _interopRequireDefault(_passwordHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEY_SESSION = 'KEY_USER_SESSION';

var Authorization = function () {

  /**
   *
   * @param {Server} server
   */
  function Authorization(server) {
    _classCallCheck(this, Authorization);

    /**
     *
     * @type {Server}
     * @private
     */
    this._server = server;

    /**
     *
     */
    this._passwordHash = _passwordHash2.default;
  }

  /**
   *
   * @param {Object} user
   * @param {string} role
   * @returns void
   */


  _createClass(Authorization, [{
    key: 'createSessionUser',
    value: function createSessionUser(user, role) {
      var session = {};
      session[KEY_SESSION] = { user: user, role: role };
      this._server.setSession(session);
    }
  }, {
    key: 'getUser',


    /**
     *
     * @returns {Object}
     */
    value: function getUser() {
      return this._server.getSession(KEY_SESSION);
    }
  }, {
    key: 'getUserRole',


    /**
     *
     * @returns {string}
     */
    value: function getUserRole() {
      var user = this._server.getSession(KEY_SESSION);
      return user.hasOwnProperty('role') ? user['role'] : 'ROLE_ANONYMOUSLY';
    }
  }, {
    key: 'hashPassword',


    /**
     *
     * @param {string} password
     * @returns {string}
     */
    value: function hashPassword(password) {
      return this._passwordHash.generate(password);
    }
  }, {
    key: 'comparePassword',


    /**
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {boolean}
     */
    value: function comparePassword(password, hashedPassword) {
      return this._passwordHash.verify(password, hashedPassword);
    }
  }]);

  return Authorization;
}();

/**
 *
 * @module Authorization
 */


exports.default = Authorization;