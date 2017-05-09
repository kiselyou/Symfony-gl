var IW = IW || {};

/**
 *
 * @param {string} [url]
 * @constructor
 */
IW.Socket = function ( url ) {

	/**
	 *
	 * @type {string}
     */
    var SOCKET_CONNECT = 'socket/connect';

	/**
	 *
	 * @type {string}
	 */
    var SOCKET_DISCONNECT = 'socket/disconnect';

	/**
	 *
	 * @type {string}
	 */
    var PATH_SUBSCRIBE = 'iw/socket/play';

	/**
	 *
	 * @type {string}
	 */
    var PATH_GET_USER = 'iw/socket/data/user';

	/**
	 * Set connect
	 *
	 * @type {WS.connect}
     */
    this.socket = WS.connect( url ? url : 'ws://127.0.0.1:9006' );

	/**
	 *
	 * @type {null}
     */
    this.session = null;

	/**
	 *
	 * @type {?number}
     */
	this.resourceId = null;

	/**
	 *
	 * @type {IW.Socket}
     */
	var scope = this;

	/**
	 *
	 * @return {?number}
     */
	this.getResourceId = function () {
		return this.resourceId;
	};

    /**
     *
	 * @param {(string|number)} key
     * @param {object} data
     */
    this.sendToCurrent = function( key, data ) {
        if ( this.session ) {
			this.session.publish(
            	PATH_SUBSCRIBE,
				{
					key: key,
					data: data,
					target: IW.Socket.ACTION_CURRENT
				}
			);
        }
    };

	/**
	 * Send to specific client
	 *
	 * @param {(string|number)} key
	 * @param {object} data
	 * @param {number} client - id is resourceId of client
	 */
	this.sendToSpecific = function( key, data, client ) {
		if ( this.session ) {
			this.session.publish(
				PATH_SUBSCRIBE,
				{
					key: key,
					data: data,
					resourceId: client,
					target: IW.Socket.ACTION_SPECIFIC
				}
			);
		}
	};

	/**
	 * Send message to all client. If second parameter is true current client will be except
	 *
	 * @param {(string|number)} key
	 * @param {object} data
	 * @param {boolean} [currentExcept]
	 */
	this.sendToAll = function( key, data, currentExcept ) {
		if ( this.session ) {
			this.session.publish(
				PATH_SUBSCRIBE,
				{
					key: key,
					data: data,
					target: currentExcept ? IW.Socket.ACTION_CURRENT_EXCEPT : IW.Socket.ACTION_ALL
				}
			);
		}
	};

    /**
     *
     * @returns {IW.Socket}
     */
    this.connect = function ( connectCallback, messageCallback ) {

		this.socket.on( SOCKET_CONNECT, function( session ) {
			scope.session = session;
			scope.session.subscribe( PATH_SUBSCRIBE, function ( url, payload ) {

				if (payload.action == IW.Socket.ACTION_SUBSCRIBE) {

					scope.resourceId = payload.resourceId;
					connectCallback.call(this, payload, payload.resourceId);

				} else {

					messageCallback.call( this, payload, payload.resourceId );
				}

			} );
		} );
    };

    /**
     *
     * @param {function} callback
     */
    this.windowCloseControls = function ( callback ) {
		window.onbeforeunload = function () {
            callback ? callback.call( this ) : null;
			scope.session.unsubscribe( PATH_SUBSCRIBE );
			return null;
		}
	};

    /**
     *
     * @returns {IW.Socket}
     */
    this.disconnected = function ( callback ) {
		this.socket.on( SOCKET_DISCONNECT, function ( session ) {
			callback.call( this, session );
		} );

        return this;
    };

    /**
     *
     */
    function error() {
        console.log( arguments );
    }
};

/**
 *
 * @type {number}
 */
IW.Socket.ACTION_SUBSCRIBE = 0;

/**
 *
 * @type {number}
 */
IW.Socket.ACTION_CURRENT = 1;

/**
 *
 * @type {number}
 */
IW.Socket.ACTION_CURRENT_EXCEPT = 2;

/**
 *
 * @type {number}
 */
IW.Socket.ACTION_SPECIFIC = 3;

/**
 *
 * @type {number}
 */
IW.Socket.ACTION_ALL = 4;
