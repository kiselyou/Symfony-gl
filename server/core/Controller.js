
class Controller {
    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        /**
         *
         * @type {Server}
         */
        this.server = server;

        /**
         *
         * @type {Connection}
         */
        this.db = this.server.db.connection;
    }

    viewResponse(res, str, status = 200) {
        res.writeHead(status, this.server.conf.contentType());
        res.end(str, this.server.conf.encoding, true);
    }

    /**
     *
     * @param res
     * @param object
     * @param status
     */
    jsonResponse(res, object, status = 200) {
        res.writeHead(status, this.server.conf.contentType(2));
        res.end(JSON.stringify(object), this.server.conf.encoding, true);
    }
}

module.exports = Controller;
