var IW = IW || {};

/**
 *
 * @constructor
 */
IW.SocketControls = function ( url ) {

    var SOCKET_CONNECT = 'socket/connect';
    var SOCKET_DISCONNECT = 'socket/disconnect';

    var PATH_SUBSCRIBE = 'iw/socket/play';
    var PATH_GET_USER = 'iw/socket/data/user';


    var _socket = WS.connect( url );

    var _session = null;

	var resourceId = null;

	this.getResourceId = function () {
		return resourceId;
	};

    /**
     *
	 * @param {(string|number)} key
     * @param {object} data
     */
    this.sendToCurrent = function( key, data ) {
        if ( _session ) {
            _session.publish(
            	PATH_SUBSCRIBE,
				{
					key: key,
					data: data,
					target: IW.SocketControls.ACTION_CURRENT
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
		if ( _session ) {
			_session.publish(
				PATH_SUBSCRIBE,
				{
					key: key,
					data: data,
					resourceId: client,
					target: IW.SocketControls.ACTION_SPECIFIC
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
		if ( _session ) {
			_session.publish(
				PATH_SUBSCRIBE,
				{
					key: key,
					data: data,
					target: currentExcept ? IW.SocketControls.ACTION_CURRENT_EXCEPT : IW.SocketControls.ACTION_ALL
				}
			);
		}
	};

    /**
     *
     * @returns {IW.SocketControls}
     */
    this.connect = function ( connectCallback, messageCallback ) {

		_socket.on( SOCKET_CONNECT, function( session ) {
			_session = session;
			session.subscribe( PATH_SUBSCRIBE, function ( url, payload ) {

				if (payload.action == IW.SocketControls.ACTION_SUBSCRIBE) {

					resourceId = payload.resourceId;
					connectCallback.call(this, payload, resourceId);

				} else {

					messageCallback.call(this, payload, resourceId);
				}

			} );
		} );


		return;

		/*
		var userConnect = {
				'user': {
					'connect': true
				}
			};

        _socket.on( SOCKET_CONNECT, function( session ) {
            _session = session;
			_session.call(
				PATH_GET_USER,
				userConnect
			).then( callback, error );

            //session.subscribe( PATH_SUBSCRIBE, callback);
        });

        return this;
		*/
    };

    /**
     *
     * @returns {IW.SocketControls}
     */
    this.disconnected = function ( callback ) {
        _socket.on( SOCKET_DISCONNECT, callback );
        return this;
    };

    /**
     *
     */
    function error() {
        console.log( arguments );
    }
};

IW.SocketControls.ACTION_SUBSCRIBE = 0;
IW.SocketControls.ACTION_CURRENT = 1;
IW.SocketControls.ACTION_CURRENT_EXCEPT = 2;
IW.SocketControls.ACTION_SPECIFIC = 3;
IW.SocketControls.ACTION_ALL = 4;
