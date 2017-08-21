var IW = IW || {};

/**
 * Before are using make sure that was included file "socket.io.js"
 *
 * @param {string} url
 * @constructor
 */
IW.Socket = function ( url ) {

	/**
	 * Set connect
	 *
	 * @type {io.connect}
     */
	this.socket = io.connect( url );

	/**
	 *
	 * @type {?number}
     */
	this.id = null;

	/**
	 *
	 * @type {IW.Socket}
     */
	var scope = this;

	/**
	 *
	 * @return {?number}
     */
	this.getID = function () {
		return this.id;
	};

    /**
	 * Send message only to current client
     *
	 * @param {(string|number)} key
     * @param {object} data
     */
    this.sendToCurrent = function( key, data ) {
		var params = {
			key: key,
			data: data
		};

		this.socket.emit(IW.Socket.EVENT_SENDER, params);
		//console.log('send - MY');
    };

	/**
	 * Send to specific client
	 *
	 * @param {(string|number)} key
	 * @param {object} data
	 * @param {number} receiverID - it is ID of client
	 */
	this.sendToSpecific = function( key, data, receiverID ) {
		var params = {
			key: key,
			data: data,
			receiverID: receiverID
		};

		this.socket.emit(IW.Socket.EVENT_SPECIFIC, params);
		//console.log('send - SPECIFIC');
	};

	/**
	 * Send message to all client. If second parameter is true current client will be except
	 *
	 * @param {(string|number)} key
	 * @param {object} data
	 * @param {boolean} [currentExcept]
	 */
	this.sendToAll = function( key, data, currentExcept ) {

		var params = {
			key: key,
			data: data
		};

		if (currentExcept) {
			// Send to all except my
			this.socket.emit( IW.Socket.EVENT_EXCEPT_SENDER, params );
			//console.log('send - EXCEPT');

		} else {
			// Send to all
			this.socket.emit( IW.Socket.EVENT_ALL, params );
			//console.log('send - ALL');
		}
	};

	// /**
	//  *
     // */
	// this.loginUser = function(id) {
	// 	this.socket.emit(IW.Socket.EVENT_LOGIN, {userID: id});
	// 	return this;
	// };

	/**
	 * Set socket connect
	 *
	 * @param {function} connectCallback
	 * @param {function} messageCallback
     */
    this.connect = function ( connectCallback, messageCallback ) {

		this.socket.on(IW.Socket.EVENT_CONNECTED, function ( data ) {
			scope.id = data.clientID;
			connectCallback.call( this, data, scope.getID() );
		});

		this.socket.on(IW.Socket.EVENT_ALL, function ( data ) {
			messageCallback.call( this, IW.Socket.EVENT_ALL, data, scope.getID() );
			//console.log('get - ALL');
		});

		this.socket.on(IW.Socket.EVENT_SENDER, function ( data ) {
			messageCallback.call( this, IW.Socket.EVENT_SENDER, data, scope.getID() );
			//console.log('get - ALL SENDER');
		});

		this.socket.on(IW.Socket.EVENT_EXCEPT_SENDER, function ( data ) {
			messageCallback.call( this, IW.Socket.EVENT_EXCEPT_SENDER, data, scope.getID() );
			//console.log('get - ALL EXCEPT');
		});

		this.socket.on(IW.Socket.EVENT_SPECIFIC, function ( data ) {
			messageCallback.call( this, IW.Socket.EVENT_SPECIFIC, data, scope.getID() );
			//console.log('get - SPECIFIC');
		});

		this.socket.on(IW.Socket.EVENT_REMOVED, function ( data ) {
			messageCallback.call( this, IW.Socket.EVENT_REMOVED, data, scope.getID() );
			//console.log('get - REMOVED');
		});
    };

	/**
	 * Unsubscribe the user
	 *
	 * @returns {IW.Socket}
     */
    this.unsubscribe = function () {
		this.socket.emit(IW.Socket.EVENT_REMOVE, { clientID: this.getID() });
		return this;
	};

    /**
     *
     * @param {function} callback
     */
    this.windowCloseControls = function ( callback ) {
		window.onbeforeunload = function () {
            callback ? callback.call( this ) : null;
			scope.unsubscribe();
			return null;
		}
	};

    /**
     *
     * @returns {IW.Socket}
     */
    this.disconnected = function ( callback ) {
		this.socket.on(IW.Socket.EVENT_DISCONNECTED, function( data ) {
			callback.call( this, data );
		});

        return this;
    };
};

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_CONNECTED = 'connected';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_SENDER = 'sender';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_EXCEPT_SENDER = 'except-sender';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_SPECIFIC = 'specific';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_ALL = 'all';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_DISCONNECT = 'disconnect';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_DISCONNECTED = 'disconnected';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_REMOVE = 'remove';

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_REMOVED = 'removed';

// /**
//  *
//  * @type {string}
//  */
// IW.Socket.EVENT_LOGIN = 'login';