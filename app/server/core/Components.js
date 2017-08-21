'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Conf = require('./Conf');

var _Conf2 = _interopRequireDefault(_Conf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Components = function () {
    function Components() {
        _classCallCheck(this, Components);

        this._req = {};
        this._res = {};

        /**
         *
         * @type {Conf}
         * @private
         */
        this._conf = new _Conf2.default();
    }

    /**
     *
     * @returns {*}
     */


    _createClass(Components, [{
        key: 'getRequest',
        value: function getRequest() {
            return this._req;
        }

        /**
         *
         * @returns {*}
         */

    }, {
        key: 'getResponse',
        value: function getResponse() {
            return this._res;
        }

        /**
         *
         * @returns {Conf}
         */

    }, {
        key: 'config',
        get: function get() {
            return this._conf;
        }
    }]);

    return Components;
}();

exports.default = Components;