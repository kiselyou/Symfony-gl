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
	this.socket = io.connect(url);

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

		this.socket.emit(IW.Socket.EVENT_SENDER, {
			key: key,
			data: data
		});
    };

	/**
	 * Send to specific client
	 *
	 * @param {(string|number)} key
	 * @param {object} data
	 * @param {number} receiverID - it is ID of client
	 */
	this.sendToSpecific = function( key, data, receiverID ) {

		this.socket.emit(IW.Socket.EVENT_SPECIFIC, {
			key: key,
			data: data,
			receiverID: receiverID
		});
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

		} else {
			// Send to all
			this.socket.emit( IW.Socket.EVENT_ALL, params );
		}
	};

	/**
	 * Set socket connect
	 *
	 * @param {function} connectCallback
	 * @param {function} messageCallback
     */
    this.connect = function ( connectCallback, messageCallback ) {

		this.socket.on(IW.Socket.EVENT_CONNECTED, function (data) {
			scope.id = data.id;
			connectCallback.call( this, data);
		});

		this.socket.on(IW.Socket.EVENT_ALL, function (data) {
			messageCallback.call( this, IW.Socket.EVENT_ALL, data, scope.getID() );
		});

		this.socket.on(IW.Socket.EVENT_SENDER, function (data) {
			messageCallback.call( this, IW.Socket.EVENT_SENDER, data, scope.getID() );
		});

		this.socket.on(IW.Socket.EVENT_EXCEPT_SENDER, function (data) {
			messageCallback.call( this, IW.Socket.EVENT_EXCEPT_SENDER, data, scope.getID() );
		});

		this.socket.on(IW.Socket.EVENT_SPECIFIC, function (data) {
			messageCallback.call( this, IW.Socket.EVENT_SPECIFIC, data, scope.getID() );
		});
    };

	/**
	 * Unsubscribe the user
	 *
	 * @returns {IW.Socket}
     */
    this.unsubscribe = function () {
		this.socket.emit(IW.Socket.EVENT_DISCONNECT, { clientID: this.getID() });
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
		this.socket.on(IW.Socket.EVENT_DISCONNECT, function(data) {
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
