'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lock = function () {
    /**
     *
     * @constructor
     */
    function Lock() {
        _classCallCheck(this, Lock);
    }

    /**
     *
     * @returns {string}
     */


    _createClass(Lock, [{
        key: 'controls',


        /**
         *
         * @returns {void}
         */
        value: function controls() {
            var socket = _socket2.default.connect(location.hostname + ':' + Lock.PORT + Lock.NAMESPACE);

            socket.on(Lock.EVENT_CONNECTED, function (data) {
                console.log(data, 'client');
            });
        }
    }], [{
        key: 'NAMESPACE',
        get: function get() {
            return '/lock';
        }

        /**
         *
         * @returns {number}
         */

    }, {
        key: 'PORT',
        get: function get() {
            return 3000;
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_CONNECTED',
        get: function get() {
            return 'connected';
        }
    }]);

    return Lock;
}();

exports.default = Lock;