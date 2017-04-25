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

    /**
     *
     * @param data
     */
    this.publish = function( data ) {
        if ( _session ) {
            _session.publish( PATH_SUBSCRIBE, data );
        }
    };
	
	this.subscribe = function ( callback ) {
		if ( _session ) {
			_session.subscribe( PATH_SUBSCRIBE, callback );
		}
	};

    /**
     *
     * @returns {IW.SocketControls}
     */
    this.connect = function ( callback ) {
		var i = 0;
		var a = 0;
		var _connectId = null;
		_socket.on( SOCKET_CONNECT, function( session ) {
			i++;
			
			// console.log( i, 'Connected', session );
			
			// var paramUserConnect = {
				// 'user': {
					// 'connect': true 
				// }
			// };
			
			// session.call( 
				// PATH_GET_USER, 
				// paramUserConnect 
			// ).then( function () {
				// console.log( 'Get data user', arguments );
			// }, error );
			
			session.subscribe( PATH_SUBSCRIBE, function ( url, payload ) {

				console.log( payload );

				// if ( payload.connect ) {
				// 	_connectId = payload[ 'connectId' ];
				// 	console.log('connected', payload);
				// } else {
				// 	// Получать все сообщения кроме своего
				// 	if ( payload[ 'connectId' ] !== _connectId ) {
				// 		console.log('Все кроме своего', payload[ 'connectId' ]);
				// 	} else { // Получить свое сообщение
				// 		console.log('Свое сообщение', payload[ 'connectId' ]);
				// 	}
				// }
				
			} );
			
			session.publish( PATH_SUBSCRIBE, {
				test_connect: true,
				'asda': 'asdas'
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