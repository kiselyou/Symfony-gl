import http from 'http';
import socketIO from 'socket.io';
import sharedsession from 'express-socket.io-session';
import Lock from './../../js/system/Lock';
import SessionControls from './SessionControls';

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
     * @param session
     * @returns {void}
     */
    listen(session) {
        let io = socketIO(this.socketServer);

        io.use(sharedsession(session, {autoSave:true}));

        let room = io.of(Lock.NAMESPACE);

        room.on('connection', (socket) => {
            /**
             *
             * @type {SessionControls}
             * @private
             */
            this._session = new SessionControls(socket.handshake.session);

            socket.emit(Lock.EVENT_CHECK_LOCK, {lock: this._addUserToList(this._session)});

            socket.on(Lock.EVENT_CHECK_USER_STATUS, () => {
                socket.emit(Lock.EVENT_CHECK_USER_STATUS, this._session.isSessionUser());
            });

            socket.on('disconnect', () => {
                this._removeUserFromList(this._session);
            });
        });

        this.socketServer.listen(this._server.config.socket.port, this._server.config.socket.host);
    }

    /**
     * Add user to list
     *
     * @param {SessionControls} session
     * @returns {boolean} - If is true user was added to list
     *                      If is false probably user is not logged or has opened another tabs
     * @private
     */
    _addUserToList(session) {
        let id = session.setSessionUserID();
        if (session.isSessionUser() && this._server.listActiveUsers.indexOf(id) === -1) {
            this._server.listActiveUsers.push(id);
            return true;
        }
        return false;
    }

    /**
     * Remove user from list
     *
     * @param {SessionControls} session
     * @returns {boolean}
     * @private
     */
    _removeUserFromList(session) {
        let key = this._server.listActiveUsers.indexOf(session.setSessionUserID());
        if (key > -1) {
            this._server.listActiveUsers.splice(key, 1);
            return true;
        }
        return false;
    }
}

export default SocketLock;
