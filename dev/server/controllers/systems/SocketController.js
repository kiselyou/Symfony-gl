
class SocketController {

    /**
     * @constructor
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    configuration(req, res) {
        this._server.responseJSON(this._server.config.socket);
    }
}

export default SocketController;
