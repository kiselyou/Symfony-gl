class SocketController {

    constructor(db, config) {
        this._server = config;
    }

    configuration(req, res) {

        let json = JSON.stringify(
            {
                config: {
                    socket: this._server.socket.host + ':' + this._server.socket.port + '/play'
                }
            }
        );

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(json);
    }
}

module.exports = SocketController;
