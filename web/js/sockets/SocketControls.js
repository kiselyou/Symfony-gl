var IW = IW || {};

/**
 *
 * @constructor
 */
IW.SocketControls = function ( url ) {

    var SOCKET_CONNECT = 'socket/connect';
    var SOCKET_DISCONNECT = 'socket/disconnect';

    var PATH_SUBSCRIBE = 'iw/socket/play';
    var PATH_GET_USER = 'iw/rpc/find_data';


    var _socket = WS.connect( url );

    var _session = null;

    /**
     *
     * @param data
     */
    this.publish = function( data ) {
        if ( _session ) {
            _session.publish(PATH_SUBSCRIBE, data);
        }
    };

    /**
     *
     * @param callback
     * @param params
     */
    this.findData = function ( callback, params ) {
        if ( _session ) {
            _session.call(PATH_GET_USER, params).then(callback, error);
        }
    };

    /**
     *
     * @returns {IW.SocketControls}
     */
    this.connect = function ( callback ) {

        _socket.on(SOCKET_CONNECT, function( session ) {
            _session = session;
            session.subscribe( PATH_SUBSCRIBE, callback);
        });

        return this;
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