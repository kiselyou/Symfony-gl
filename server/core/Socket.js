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

const http = require('http');
const io = require('socket.io');

class Socket {
    /**
     *
     * @param {express} app
     * @param {Server} components
     * @constructor
     */
    constructor(app, components) {
        /**
         *
         * @type {Server}
         */
        this.components = components;

        this.socketServer = http.createServer(app);
        this.io = io(this.socketServer);
        this.users = {};

    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_LOGIN() {
        return 'login';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_LOCK() {
        return 'event_lock';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_REMOVED() {
        return 'removed';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_REMOVE() {
        return 'remove';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_CONNECTED() {
        return 'connected';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_SENDER() {
        return 'sender';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_EXCEPT_SENDER() {
        return 'except-sender';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_SPECIFIC() {
        return 'specific';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_ALL() {
        return 'all';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_DISCONNECT() {
        return 'disconnect';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_DISCONNECTED() {
        return 'disconnected';
    }

    /**
     *
     * @param {string} namespace
     */
    listen(namespace) {

        var room = this.io.of(namespace);

        room.on('connection', (socket) => {

            //console.log(this.components.auth.getSessionUser());

            // Подписался
            var params = { clientID: socket.id };
            socket.emit(Socket.EVENT_CONNECTED, params);

            // Слушаем запросы клиента

            // Отправить ответ только себе
            socket.on(Socket.EVENT_SENDER, (data) => {
                socket.emit(Socket.EVENT_SENDER, data);
            });

            // Отправить всем кроме себя
            socket.on(Socket.EVENT_EXCEPT_SENDER, (data) => {
                // Отправляем сообщени всем кроме себя
                socket.broadcast.emit(Socket.EVENT_EXCEPT_SENDER, data);

            });

            // Отправить конкретному пользователю сообщение
            socket.on(Socket.EVENT_SPECIFIC, (data) => {
                socket.broadcast.to(data.receiverID).emit(Socket.EVENT_SPECIFIC, data);
            });

            socket.on(Socket.EVENT_ALL, (data) => {
                room.emit(Socket.EVENT_ALL, data);
            });

            socket.on(Socket.EVENT_DISCONNECT, () => {
                // room.emit('disconnected', { clientID: socket.id });
                socket.broadcast.emit(Socket.EVENT_DISCONNECTED, { clientID: socket.id });
            });

            socket.on(Socket.EVENT_REMOVE, () => {
                socket.broadcast.emit(Socket.EVENT_REMOVED, { clientID: socket.id });
            });

            socket.on(Socket.EVENT_LOCK, (data) => {
                socket.broadcast.to(data.receiverID).emit(Socket.EVENT_LOCK, data);
            });
        });

        this.socketServer.listen(this.components.conf.socket.port, this.components.conf.socket.host);
    }
}

module.exports = Socket;
