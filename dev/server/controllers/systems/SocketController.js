
class SocketController {

    /**
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;
    }

    /**
     *
     * @param {ServerHttp} http
     * @returns {void}
     */
    configuration(http) {
	    http.responseJSON(this._server.config.socket);
    }
}

export default SocketController;
