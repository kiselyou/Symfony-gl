
import express from 'express';
import session from 'express-session';
import express_ejs_extend from 'express-ejs-extend';
import bodyParser from 'body-parser';
import multer from 'multer';

import path from 'path';
import Routes from './Routes';
import Collection from '../controllers/Collection';


import Socket from './Socket';
import Security from './security/Security';
import Components from './Components';
import Authorization from './security/Authorization';

const PATH_404 = 'error/404';

class Server extends Components {
    constructor() {
        super();

        /**
         * @type {express}
         * @private
         */
        this._app = express();

        /**
         * @type {multer}
         * @private
         */
        this._upload = multer();

        /**
         *
         * @type {Collection}
         * @private
         */
        this._collection = new Collection(this);

        /**
         *
         * @type {Routes}
         * @private
         */
        this._routes = new Routes();

        /**
         *
         * @type {Socket}
         * @private
         */
        this._socket = new Socket(this);

        /**
         *
         * @type {Security}
         */
        this._security = new Security(this);
    }

    /**
     *
     * @returns {*}
     */
    getApp() {
        return this._app;
    }

    /**
     *
     * @private
     */
    _createRoutes() {

        this._routes.load((routes) => {

            // this._app.use('/dist/', express.static(path.join(__dirname, '/../../' + this.conf.pathEnvironment)));

            for (let route of routes) {
                switch (route['method']) {
                    case 'POST':
                        this._app.post(route['route'], this._upload.array(), (req, res) => {
                            this._req = req;
                            this._res = res;
                            this.sendResponse(route);
                        });
                        break;
                    case 'GET':
                        this._app.get(route['route'], (req, res) => {
                            this._req = req;
                            this._res = res;
                            this.sendResponse(route);
                        });
                        break;
                    case 'SOCKET':
                        this._socket.listen(route['route'], route['port'], route['host']);
                        break;
                    default:
                        this._app.all(route['route'], (req, res) => {
                            this._req = req;
                            this._res = res;
                            this.sendResponse(route);
                        });
                        break;
                }
            }

            this._app.get('*', (req, res) => {
                this._req = req;
                this._res = res;
                this.responseView(PATH_404, {msg: 'The page "' + this._req.url + '" was not found.'});
            });
        });
    }

    /**
     *
     * @param {{method: string, route: string, viewPath: string}} params
     * @returns {void}
     */
    sendResponse(params) {
        if (this._security.isGranted(this._req.url, this._security.getUserRole())) {
            if (params.hasOwnProperty('viewPath')) {
                this.responseView(params['viewPath']);
            } else {
                this.responseController(params);
            }
        } else {
            this.responseView(PATH_404, {code: 423, msg: 'Permission denied!'});
        }
    }

    /**
     * Call to controller
     *
     * @param {{method: string, route: string, viewPath: string, controller: string}} params
     * @returns {Server}
     */
    responseController(params) {
        // 0 - name of controller 1 - method
        let data = params['controller'].split(':');

        if (data.length !== 2) {
            this.responseView(PATH_404, {code: 404, msg: 'Route configuration is not correct'});
            return this;
        }

        try {
            let method = data[1];
            let controller = data[0];
            this._collection[controller][method](this.req, this.res, params);
        } catch (e) {
            this.responseView(PATH_404, {code: 404, msg: 'Route configuration is not correct'});
        }
        return this;
    };

    /**
     * Send view to client
     *
     * @param {string} path - it is path to template ejs
     * @param {Object} params
     * @returns {Server}
     */
    responseView(path, params = {}) {
        this._res.render(path, params);
        // this._res.writeHead(200, {'Content-Type': 'text/html'});
        // this._res.end(str, 'utf-8', true);
        return this;
    };

    /**
     *
     * Send json to client
     *
     * @param {{}|[]} data
     * @returns {Server}
     */
    responseJSON(data) {
        this._res.writeHead(200, {'Content-Type': 'application/json'});
        this._res.end(JSON.stringify(data), 'utf-8', true);
        return this;
    };

    /**
     *
     * @returns {Server}
     */
    init() {
        this._app.engine('ejs', express_ejs_extend);
        this._app.set('view engine', 'ejs');

        this._app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}));
        this._app.use(bodyParser.urlencoded({extended: false}));
        this._app.use(bodyParser.json());
        this._createRoutes();
        this._app.listen(this._conf.server.port, this._conf.server.host);
        return this;
    }
}

export default Server;
