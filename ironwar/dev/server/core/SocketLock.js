import http from 'http';
import socketIO from 'socket.io';
import sharedsession from 'express-socket.io-session';
import Lock from './../../js/system/Lock';
import SessionControls from './SessionControls';

class SocketLock {
    /**
     *
     * @param {express} app
     * @param {Array} listUsers
     */
    constructor(app, listUsers) {

        /**
         *
         * @type {Array}
         * @private
         */
        this._listUsers = listUsers;

        this.socketServer = http.createServer(app);
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

            socket.emit(Lock.EVENT_CHECK_STATUS, {status: this._addUserToList(this._session)});

            socket.on('disconnect', () => {
                this._removeUserFromList(this._session);
            });
        });

        this.socketServer.listen(Lock.PORT, 'localhost');
    }

    /**
     * Add user to list
     *
     * @param {SessionControls} session
     * @returns {boolean}
     * @private
     */
    _addUserToList(session) {
        let id = session.setSessionUserID();
        if (session.isSessionUser() && this._listUsers.indexOf(id) === -1) {
            this._listUsers.push(id);
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
        let key = this._listUsers.indexOf(session.setSessionUserID());
        if (key > -1) {
            this._listUsers.splice(key, 1);
            return true;
        }
        return false;
    }
}

export default SocketLock;
