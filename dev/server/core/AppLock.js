// import http from 'http';
// import socketIO from 'socket.io';
import Lock from './../../js/system/Lock';
import Authorization from "./security/Authorization";
// import Session from './security/Session';

class AppLock {
	/**
	 *
	 * @param {Server} server
	 */
	constructor(server) {
		
		/**
		 *
		 * @type {io}
		 */
		this.io = server.io;
		
		/**
		 *
		 * @type {Server}
		 */
		this.server = server;
		
		// /**
		//  *
		//  * @type {Server}
		//  * @private
		//  */
		// this._server = server;
		//
		// /**
		//  *
		//  * @type {{port: number, host: string}}
		//  * @private
		//  */
		// this._conf = server.config.socket;
		//
		// this.socketServer = http.createServer(this._server.getApp());
	}
	
	/**
	 *
	 * @returns {void}
	 */
	listen() {
		
		this.io.of(Lock.NAMESPACE).on('connection', (socket) => {
			
			let auth = new Authorization(socket.handshake.session);
			
			console.log(socket.handshake.session, '++++++++');
			// console.log(
			// 	auth.getSessionUserID()
			// );
			
			socket.emit(Lock.EVENT_LOCK, this.server.checkLock(auth.getSessionUserID()));
			
		});
		
		// let io = socketIO(this.socketServer);
		//
		//
		// io.of(Lock.NAMESPACE).on('connection', (socket) => {
		//
		//
		//
		// 	this._addUserToList(socket.id, this._server.session);
		// 	socket.emit(Lock.EVENT_LOCK, this._server.checkLock(this._server.session.setSessionUserID()));
		//
		// 	socket.on(Lock.EVENT_LOCK, () => {
		// 		this._addUserToList(socket.id, this._server.session);
		// 		socket.emit(Lock.EVENT_LOCK, this._server.checkLock(this._server.session.setSessionUserID()));
		// 	});
		//
		// 	socket.on(Lock.EVENT_UNLOCK, () => {
		// 		this._removeUserFromList(socket.id);
		// 		socket.emit(Lock.EVENT_UNLOCK, this._server.checkLock(this._server.session.setSessionUserID()));
		// 	});
		//
		// 	socket.on('disconnect', () => {
		// 		this._removeUserFromList(socket.id);
		// 	});
		// });
		//
		// this.socketServer.listen(this._conf.port, this._conf.host);
	}
	
	// /**
	//  * Add user to list
	//  *
	//  * @param {string|number} key
	//  * @param {Session} session
	//  * @returns {boolean} - If is true user was added to list
	//  *                      If is false probably user is not logged or has opened another tabs
	//  * @private
	//  */
	// _addUserToList(key, session) {
	// 	if (session.isSessionUser() && !this._server.listActiveUsers.hasOwnProperty(key)) {
	// 		this._server.listActiveUsers[key] = session.setSessionUserID();
	// 		return true;
	// 	}
	// 	return false;
	// }
	//
	// /**
	//  * Remove user from list
	//  *
	//  * @param {string|number} key
	//  * @returns {boolean}
	//  * @private
	//  */
	// _removeUserFromList(key) {
	// 	if (this._server.listActiveUsers.hasOwnProperty(key)) {
	// 		delete this._server.listActiveUsers[key];
	// 		return true;
	// 	}
	// 	return false;
	// }
}

export default AppLock;
