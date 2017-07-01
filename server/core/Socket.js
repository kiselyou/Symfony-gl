// // sending to sender-client only
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

const EVENT_CONNECTED = 'connected';
const EVENT_SENDER = 'sender';
const EVENT_EXCEPT_SENDER = 'except-sender';
const EVENT_SPECIFIC = 'specific';
const EVENT_ALL = 'all';
const EVENT_DISCONNECT = 'disconnect';
const EVENT_DISCONNECTED = 'disconnected';
const EVENT_REMOVE = 'remove';
const EVENT_REMOVED = 'removed';

class Socket {
    /**
     *
     * @type {{ port: number, host: string }}
     */
    constructor(app, config) {
        /**
         *
         * @param {express} app
         * @type {{ port: number, host: string }}
         */
        this.config = config;
        this.server = require('http').createServer(app);
        this.io = require('socket.io')(this.server);
    }

    listen(namespace) {
        var scope = this;

        var room = this.io.of(namespace);

        room.on('connection', function(socket){

            // Подписался
            var params = { clientID: socket.id };
            socket.emit(EVENT_CONNECTED, params);

            // Слушаем запросы клиента

            // Отправить ответ только себе
            socket.on(EVENT_SENDER, function (data) {
                socket.emit(EVENT_SENDER, data);
            });

            // Отправить всем кроме себя
            socket.on(EVENT_EXCEPT_SENDER, function (data) {
                // Отправляем сообщени всем кроме себя
                socket.broadcast.emit(EVENT_EXCEPT_SENDER, data);

            });

            // Отправить конкретному пользователю сообщение
            socket.on(EVENT_SPECIFIC, function (data) {
                socket.broadcast.to(data.receiverID).emit(EVENT_SPECIFIC, data);
            });

            socket.on(EVENT_ALL, function (data) {
                room.emit(EVENT_ALL, data);
            });

            socket.on(EVENT_DISCONNECT, function () {
                // room.emit('disconnected', { clientID: socket.id });
                socket.broadcast.emit(EVENT_DISCONNECTED, { clientID: socket.id });
            });

            socket.on(EVENT_REMOVE, function () {
                socket.broadcast.emit(EVENT_REMOVED, { clientID: socket.id });
            });
        });

        this.server.listen(this.config.port, this.config.host);
    }
}

module.exports = Socket;
