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

var IW = IW || {};

/**
 *
 * @param {express} app
 * @constructor
 */
IW.Socket = function ( app ) {
    this.server = require('http').createServer(app);
    this.io = require('socket.io')(this.server);
};

IW.Socket.prototype.io = null;
IW.Socket.prototype.server = null;

/**
 *
 * @param {string} namespace
 */
IW.Socket.prototype.listen = function (namespace) {
    var scope = this;
    this.io
        .of(namespace)
        .on('connection', function(socket){

            console.log(socket.id);

            // Подписался
            socket.emit('connected', { hello: 'Ты подписался на ' + namespace + ' Вот тебе ID: ' + socket.id, id: socket.id });

            // Слушаем запросы клиента

            // Отправить ответ только себе
            socket.on('action-only-sender', function (data) {
                // Что нибуди делаем с данными и возаращаем ответ себеже
                console.log('Только себе', data);
                // socket.emit('only-sender', { message: 'Ты отправил сообщения себе!' });
                socket.emit('only-sender', { message: 'Ты отправил сообщения себе!' });
            });

            // Отправить всем кроме себя
            socket.on('action-except-sender', function (data) {
                console.log('Всем кроме себя', data);
                // Отправляем сообщени всем кроме себя
                socket.broadcast.emit('except-sender', data);

            });

            // Отправить конкретномы пользователю сообщение
            socket.on('action-only-specific', function (data) {
                console.log(data);
                socket.broadcast.to(data.id).emit('only-specific', data);
            });

            socket.on('action-to-all', function (data) {
                console.log(data);
                // scope.io.of(namespace).emit('to-all', data);
                scope.io.emit('to-all', data);
            });
        });

    this.server.listen(3000);
};

module.exports = IW;
