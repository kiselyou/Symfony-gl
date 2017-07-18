
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

        this.req = this.server.req;
        this.res = this.server.res;

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
     * @returns {{}}
     */
    getPostData() {
        return this.req.body;
    }

    /**
     *
     * @returns {{}}
     */
    getData() {
        let data = {};
        for (let key in this.req.params) {
            if (this.req.params.hasOwnProperty(key)) {
                data[key] = this.req.params[key];
            }
        }
        for (let key in this.req.query) {
            if (this.req.query.hasOwnProperty(key)) {
                data[key] = this.req.query[key];
            }
        }
        return data;
    }

    /**
     * @deprecated
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
     * @deprecated
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
