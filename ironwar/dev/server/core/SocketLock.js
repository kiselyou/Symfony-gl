import http from 'http';
import socketIO from 'socket.io';
import Lock from './../../js/system/Lock';
import Session from './security/Session';

class SocketLock {
    /**
     *
     * @param {Server} server
     */
    constructor(server) {

        /**
         *
         * @type {Server}
         * @private
         */
        this._server = server;

        this.socketServer = http.createServer(this._server.getApp());
    }

    /**
     *
     * @returns {void}
     */
    listen() {
        let io = socketIO(this.socketServer);

        io.of(Lock.NAMESPACE).on('connection', (socket) => {

            this._addUserToList(socket.id, this._server.session);

            socket.on(Lock.EVENT_CHECK_LOCK, () => {
                socket.emit(Lock.EVENT_CHECK_LOCK, this._server.checkLock(this._server.session.setSessionUserID()));
            });

            socket.on(Lock.EVENT_LOCK, () => {
                this._addUserToList(socket.id, this._server.session);
            });

            socket.on(Lock.EVENT_UNLOCK, () => {
                this._removeUserFromList(socket.id);
            });

            socket.on('disconnect', () => {
                this._removeUserFromList(socket.id);
            });
        });

        this.socketServer.listen(this._server.config.socket.port, this._server.config.socket.host);
    }

    /**
     * Add user to list
     *
     * @param {string|number} key
     * @param {Session} session
     * @returns {boolean} - If is true user was added to list
     *                      If is false probably user is not logged or has opened another tabs
     * @private
     */
    _addUserToList(key, session) {
        if (session.isSessionUser() && !this._server.listActiveUsers.hasOwnProperty(key)) {
            this._server.listActiveUsers[key] = session.setSessionUserID();
            return true;
        }
        return false;
    }

    /**
     * Remove user from list
     *
     * @param {string|number} key
     * @returns {boolean}
     * @private
     */
    _removeUserFromList(key) {
        if (this._server.listActiveUsers.hasOwnProperty(key)) {
            delete this._server.listActiveUsers[key];
            return true;
        }
        return false;
    }
}

export default SocketLock;
