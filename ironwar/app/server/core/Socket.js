'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // // sending to sender-client only
// socket.emit('message', "this is a test");
//
// // sending to all clients, include sender
// io.emit('message', "this is a test");
//
// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");
//
// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');
//
// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');
//
// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');
//
// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');
//
// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {
    /**
     *
     * @param {Server} server
     * @constructor
     */
    function Socket(server) {
        _classCallCheck(this, Socket);

        /**
         *
         * @type {Server}
         */
        this._server = server;

        this.socketServer = _http2.default.createServer(this._server.getApp());
        this.io = (0, _socket2.default)(this.socketServer);
        this.users = {};
    }

    /**
     *
     * @returns {string}
     */


    _createClass(Socket, [{
        key: 'listen',


        /**
         *
         * @param {string} namespace
         * @param {number} port
         * @param {string} host
         */
        value: function listen(namespace, port, host) {

            var room = this.io.of(namespace);

            room.on('connection', function (socket) {

                //console.log(this._server.auth.getSessionUser());

                // Подписался
                var params = { clientID: socket.id };
                socket.emit(Socket.EVENT_CONNECTED, params);

                // Слушаем запросы клиента

                // Отправить ответ только себе
                socket.on(Socket.EVENT_SENDER, function (data) {
                    socket.emit(Socket.EVENT_SENDER, data);
                });

                // Отправить всем кроме себя
                socket.on(Socket.EVENT_EXCEPT_SENDER, function (data) {
                    // Отправляем сообщени всем кроме себя
                    socket.broadcast.emit(Socket.EVENT_EXCEPT_SENDER, data);
                });

                // Отправить конкретному пользователю сообщение
                socket.on(Socket.EVENT_SPECIFIC, function (data) {
                    socket.broadcast.to(data.receiverID).emit(Socket.EVENT_SPECIFIC, data);
                });

                socket.on(Socket.EVENT_ALL, function (data) {
                    room.emit(Socket.EVENT_ALL, data);
                });

                socket.on(Socket.EVENT_DISCONNECT, function () {
                    // room.emit('disconnected', { clientID: socket.id });
                    socket.broadcast.emit(Socket.EVENT_DISCONNECTED, { clientID: socket.id });
                });

                socket.on(Socket.EVENT_REMOVE, function () {
                    socket.broadcast.emit(Socket.EVENT_REMOVED, { clientID: socket.id });
                });

                socket.on(Socket.EVENT_LOCK, function (data) {
                    socket.broadcast.to(data.receiverID).emit(Socket.EVENT_LOCK, data);
                });
            });

            this.socketServer.listen(port, host);
        }
    }], [{
        key: 'EVENT_LOGIN',
        get: function get() {
            return 'login';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_LOCK',
        get: function get() {
            return 'event_lock';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_REMOVED',
        get: function get() {
            return 'removed';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_REMOVE',
        get: function get() {
            return 'remove';
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

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_SENDER',
        get: function get() {
            return 'sender';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_EXCEPT_SENDER',
        get: function get() {
            return 'except-sender';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_SPECIFIC',
        get: function get() {
            return 'specific';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_ALL',
        get: function get() {
            return 'all';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_DISCONNECT',
        get: function get() {
            return 'disconnect';
        }

        /**
         *
         * @returns {string}
         */

    }, {
        key: 'EVENT_DISCONNECTED',
        get: function get() {
            return 'disconnected';
        }
    }]);

    return Socket;
}();

exports.default = Socket;