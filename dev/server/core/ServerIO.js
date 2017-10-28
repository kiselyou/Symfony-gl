import http from 'http';
import socket from 'socket.io';

class ServerIO {
	
	/**
	 *
	 * @param {express} app
	 * @param {number} port
	 * @param {string} host
	 */
	constructor(app, port, host) {
		let server = http.createServer(app);
		server.listen(port, host);
		this.io = socket(server);
	}
	
	/**
	 *
	 * @returns {io}
	 */
	get() {
		return this.io;
	}
	
	/**
	 *
	 * @param {Object} session
	 * @returns {function(*, *=)}
	 * @private
	 */
	_ios(session) {
		return (socket, next) => {
			session(socket.handshake, {}, next);
		};
	};
	
	/**
	 *
	 * @param {string} namespace
	 * @param {Object} session
	 * @returns {ServerIO}
	 */
	useSession(namespace, session) {
		this.io.of(namespace).use(this._ios(session));
		return this;
	}
	
	/**
	 * @param {Object} socket
	 * @callback socketListener
	 */
	
	/**
	 *
	 * @param {string} namespace
	 * @param {socketListener} listener
	 * @returns {ServerIO}
	 */
	connect(namespace, listener) {
		this.io.of(namespace).on('connection', listener);
		return this;
	}
}

export default ServerIO;