'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _EJSController = require('./systems/EJSController');

var _EJSController2 = _interopRequireDefault(_EJSController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function Collection(server) {
    _classCallCheck(this, Collection);

    this.EJSController = new _EJSController2.default(server);
};

exports.default = Collection;