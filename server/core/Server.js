const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const Error = require('./Error');
const Components = require('./Components');
const Socket = require('./Socket.js');

class Server extends Components {

    constructor() {
        super();
        this.db.open();
    }

    /**
     *
     * @returns {Server}
     */
    routeControls() {
        let scope = this;
        this.routes.load(function (routes) {
            app.use('/app/', express.static(scope.routes.joinPath(__dirname, '/../../' + scope.pathEnvironment)));
            for (let i = 0; i < routes.length; i++) {
                scope.createRoute(routes[i]);
            }
            app.get('*', function(req, res) {
                let template = scope.view.prepareTemplateError('The page "' + req.url + '" was not found. Server.routeControls()');
                scope.response(req, res, template.content);
            });
        });

        return this;
    }

    /**
     *
     * @param {{method: string, route: string, viewPath: string}} params
     * @returns {Server}
     */
    createRoute(params) {
        let scope = this;
        switch (params['method']) {
            case 'POST':
                app.post(params['route'], function(req, res) {
                    scope.sendResponse(req, res, params);
                });
                break;
            case 'GET':
                app.get(params['route'], function(req, res) {
                    scope.sendResponse(req, res, params);
                });
                break;
            default:
                app.all(params['route'], function(req, res) {
                    scope.sendResponse(req, res, params);
                });
                break;
        }
        return this;
    };

    /**
     *
     * @param req
     * @param res
     * @param {{method: string, route: string, viewPath: string}} params
     * @returns {Server}
     */
    sendResponse(req, res, params) {
        let template = null;
        if (this.secur.isGranted(req.url, this.secur.getSessionRole(req))) {
            if (params.hasOwnProperty('viewPath')) {
                template = this.view.prepareTemplate(params['route'], params['viewPath']);
            } else {
                this.callToController(req, res, params);
                return this;
            }
        } else {
            template = this.view.prepareTemplateError('Permission Denied. Page: "' + req.url + '". Server.sendResponse()');
        }
        if (template) {
            this.response(req, res, template['content']);
        } else {
            new Error(null).message('Something wrong. Server.sendResponse()');
        }
        return this;
    };

    /**
     * Call to controller
     *
     * @param {{}} req
     * @param {{}} res
     * @param {{method: string, route: string, viewPath: string, controller: string}} params
     * @returns {Server}
     */
    callToController(req, res, params) {
        // 0 - module, 1 - name of controller 2 - method
        let data = params['controller'].split(':');

        if (data.length !== 3) {
            let msg = 'Route configuration is not correct. Server.callToController()';
            new Error(null).message(msg);
            res.writeHead(200, this.contentType(2));
            res.end(msg);
            return this;
        }
        let method = data[2];
        let file = data[0] + '/' + data[1] + '.js';
        let path = this.routes.joinPath(this.routes.joinPath(__dirname, '/../../' + this.pathController), file);
        try {
            let Controller = require(path);
            let object = new Controller(this, this.db.connection);
            object[method](req, res);

        } catch (e) {
            let msg = 'Error:' + e.message + ' in route: "' + file + '" method "' + method + '". Server.callToController()';
            new Error(e).message(msg);
            res.writeHead(200, this.contentType(2));
            res.end(msg);
        }
        return this;
    };

    /**
     *
     * Send response to client
     *
     * @param {{}} req
     * @param {{}} res
     * @param {{ status: boolean, content: string, error: string }} str
     * @returns {Server}
     */
    response(req, res, str) {
        res.writeHead(200, this.contentType());
        res.end(str, this.encoding, true);
        return this;
    };

    /**
     *
     * @returns {Server}
     */
    init() {
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        this.routeControls();
        app.listen(this.server.port, this.server.host);
        return this;
    }

    /**
     *
     * @returns {Server}
     */
    initSocket() {
        let socket = new Socket(app, this.socket);
        socket.listen('play');
        return this;
    };
}

module.exports = Server;
