'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Conf = function () {
  function Conf() {
    _classCallCheck(this, Conf);

    /**
     * @type {{encoding: string, server: {port: number, host: string}, socket: {port: number, host: string}}}
     */
    this._conf = require('../config/config.json');

    /**
     * @type {{database: {host: string, port: number, user: string, password: string, database: string}}}
     */
    this.database = require('../config/database.json');

    /**
     * @type {{mailer: {sender: string, transporter: {host: string, port: number, secure: bool, auth: {user: string, pass: string}}}}}
     */
    this.mailer = require('../config/mailer.json');

    /**
     * @type {{security: {access_control: [{path: ''}, {path: "/home", role: "ROLE_IW_USER"}],role_hierarchy: {ROLE_ANONYMOUSLY: [], ROLE_IW: [ROLE_ANONYMOUSLY], ROLE_IW_USER: [ROLE_IW], ROLE_IW_ADMIN: [ROLE_IW_USER]}}}}
     */
    this.security = require('../config/security.json');
  }

  /**
   *
   * @returns {{port: number, host: string}}
   */


  _createClass(Conf, [{
    key: 'server',
    get: function get() {
      return this._conf.server;
    }

    /**
     *
     * @returns {{port: number, host: string}}
     */

  }, {
    key: 'socket',
    get: function get() {
      return this._conf.socket;
    }

    /**
     *
     * @returns {Array}
     */

  }, {
    key: 'accessControl',
    get: function get() {
      return this.security && this.security.hasOwnProperty('access_control') ? this.security['access_control'] : [];
    }

    /**
     *
     * @returns {Object}
     */

  }, {
    key: 'roleHierarchy',
    get: function get() {
      return this.security && this.security.hasOwnProperty('role_hierarchy') ? this.security['role_hierarchy'] : {};
    }
  }]);

  return Conf;
}();

/**
 *
 * @module Conf
 */


exports.default = Conf;