'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _Lock = require('./../../js/system/Lock');

var _Lock2 = _interopRequireDefault(_Lock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketLock = function () {
    /**
     *
     * @param {express} app
     * @param {Array} clientList
     */
    function SocketLock(app, clientList) {
        _classCallCheck(this, SocketLock);

        this.socketServer = _http2.default.createServer(app);
    }

    _createClass(SocketLock, [{
        key: 'listen',
        value: function listen() {
            var io = (0, _socket2.default)(this.socketServer);
            var room = io.of(_Lock2.default.NAMESPACE);

            room.on('connection', function (socket) {
                console.log('connection');

                var params = { clientID: socket.id };

                socket.emit(_Lock2.default.EVENT_CONNECTED, params);
            });

            // console.log(Lock.NAMESPACE, Lock.PORT, 'localhost');
            this.socketServer.listen(_Lock2.default.PORT, 'localhost');
        }
    }]);

    return SocketLock;
}();

exports.default = SocketLock;