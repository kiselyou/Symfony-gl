import Lock from '../../../js/system/Lock';
import Authorization from "../security/Authorization";

class SocketAppLock {
	/**
	 *
	 * @param {Server} server
	 */
	constructor(server) {
		
		/**
		 *
		 * @type {ServerIO}
		 */
		this.io = server.io;
		
		/**
		 *
		 * @type {Server}
		 */
		this.server = server;
	}
	
	/**
	 *
	 * @param {Object} session
	 * @returns {SocketAppLock}
	 */
	useSession(session) {
		this.io.useSession(Lock.NAMESPACE, session);
		return this;
	}
	
	/**
	 *
	 * @returns {void}
	 */
	listen() {
		this.io.connect(Lock.NAMESPACE, (socket) => {
			let auth = new Authorization(socket.handshake.session);
			
			console.log(socket.handshake.session, 'start');
			
			
			this._addUserToList(socket.id, auth);
			socket.emit(
				Lock.EVENT_LOCK,
				this.server.checkLock(auth.getSessionUserID())
			);
			
			socket.on(Lock.EVENT_LOCK, () => {
				
				console.log(socket.handshake.session, 'lock');
				
				this._addUserToList(socket.id, auth);
				socket.emit(
					Lock.EVENT_LOCK,
					this.server.checkLock(auth.getSessionUserID())
				);
			});
			
			socket.on(Lock.EVENT_UNLOCK, () => {
				
				console.log(socket.handshake.session, 'unlock');
				
				this._removeUserFromList(socket.id);
				socket.emit(
					Lock.EVENT_UNLOCK,
					this.server.checkLock(auth.getSessionUserID())
				);
			});
			
			socket.on('disconnect', () => {
				
				console.log(socket.handshake.session, 'disconnect');
				
				this._removeUserFromList(socket.id);
			});
		});
	}
	
	/**
	 * Add user to list
	 *
	 * @param {string|number} key
	 * @param {Authorization} auth
	 * @returns {boolean} - If is true user was added to list
	 *                      If is false probably user is not logged or has opened another tabs
	 * @private
	 */
	_addUserToList(key, auth) {
		if (auth.isSessionUser() && !this.server.listActiveUsers.hasOwnProperty(key)) {
			this.server.listActiveUsers[key] = auth.getSessionUserID();
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
		if (this.server.listActiveUsers.hasOwnProperty(key)) {
			delete this.server.listActiveUsers[key];
			return true;
		}
		return false;
	}
}

export default SocketAppLock;
