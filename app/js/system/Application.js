'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Ajax = require('./Ajax');

var _Ajax2 = _interopRequireDefault(_Ajax);

var _Lock = require('./Lock');

var _Lock2 = _interopRequireDefault(_Lock);

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import templateError from './../view/error.ejs';

var Application = function Application() {
  _classCallCheck(this, Application);

  console.log('Application');

  /**
   *
   * @type {Ajax}
   */
  this.ajax = new _Ajax2.default();

  /**
   *
   * @type {Lock}
   */
  this.lock = new _Lock2.default();

  this.ejs = _ejs2.default;

  /**
   *
   *
   *
   * @type {Error}
   */
  this.error = new _Error2.default();
};

exports.default = Application;