const Controller = require('./../../core/Controller');

class SocketController extends Controller {

    /**
     * @constructor
     * @param {Server} server
     */
    constructor(server) {
        super(server);
        this._server = server;
    }

    configuration(req, res) {
        let route = this.getRoute(this.get(req, 'route'), 'route');

        let json = JSON.stringify(
            {
                config: {
                    userID: this._server.auth.getSessionUser(req),
                    socket: this._server.conf.socket.host + ':' + this._server.conf.socket.port + route
                }
            }
        );

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(json);
    }
}

module.exports = SocketController;
