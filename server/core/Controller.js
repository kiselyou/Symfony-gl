
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

    /**
     *
     * @param exception
     * @param msg
     * @param className
     * @param methodName
     * @returns {Controller}
     */
    error(exception, msg = null, className = null, methodName = null) {
        this.server.err.exception(exception).alert(msg, className, methodName);
        return this;
    }

    /**
     *
     * @param req
     * @param key
     * @returns {null}
     */
    get(req, key) {
        return req.params.hasOwnProperty(key) ? req.params[key] : null;
    }

    /**
     *
     * @param name
     * @param key
     * @returns {*}
     */
    getRoute(name, key = null) {
        let routeData = this._server.routes.get(name);
        if (typeof key === 'string') {
            return routeData && routeData.hasOwnProperty(key) ? routeData[key] : null;
        }
        return routeData;
    }

    /**
     *
     * @param req
     * @param fieldName
     * @returns {*}
     */
    post(req, fieldName) {
        return req.body.find((value) => {
            return value.name === fieldName;
        }).value;
    }

    /**
     *
     * @param res
     * @param str
     * @param status
     */
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
