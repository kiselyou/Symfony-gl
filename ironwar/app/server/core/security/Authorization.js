'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _passwordHash = require('password-hash');

var _passwordHash2 = _interopRequireDefault(_passwordHash);

var _SessionControls = require('./../SessionControls');

var _SessionControls2 = _interopRequireDefault(_SessionControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    /**
     *
     * @type {SessionControls}
     */
    this.sessionControls = new _SessionControls2.default(this._req);
  }

  /**
   * Create session of user
   *
   * @param {(string|number)} id
   * @param {string} role
   * @param {Object} [info]
   * @returns {Authorization}
   */


  _createClass(Authorization, [{
    key: 'createSessionUser',
    value: function createSessionUser(id, role) {
      var info = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      info['role'] = role;
      this.sessionControls.setSessionUser(id, info);
      return this;
    }
  }, {
    key: 'getSessionUser',


    /**
     * Get session of user
     *
     * @returns {Object}
     */
    value: function getSessionUser() {
      return this.sessionControls.getSessionUser();
    }
  }, {
    key: 'getSessionUserRole',


    /**
     * Get role of user
     *
     * @returns {string}
     */
    value: function getSessionUserRole() {
      var user = this.sessionControls.getSessionUser();
      return user ? user['role'] : 'ROLE_ANONYMOUSLY';
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