
import path from 'path';
import express from 'express';
import expressSession from 'express-session';
import express_ejs_extend from 'express-ejs-extend';
import bodyParser from 'body-parser';
import multer from 'multer';

import Routes from './Routes';
import Socket from './Socket';
import SocketLock from './SocketLock';
import MySQLConnect from './db/MySQLConnect';

import Components from './Components';
import EntityCollection from '../entity/EntityCollection';
import ControllerCollection from '../controllers/ControllerCollection';

class Server extends Components {

    /**
     * Possible values it are constants of class "Conf"
     *
     * @param {string} env (Conf.ENV_DEV|Conf.ENV_PROD)
     */
    constructor(env) {
        super(env);

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
         * It is db connect
         *
         * @type {MySQLConnect}
         */
        this.db = new MySQLConnect(this.config).open();

        /**
         *
         * @type {Collection}
         * @private
         */
        this._entityCollection = new EntityCollection(this);

        /**
         *
         * @type {Collection}
         * @private
         */
        this._controllerCollection = new ControllerCollection(this);

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
         * It is list IDs of current users in system
         *
         * @type {Object}
         */
        this.listActiveUsers = {};

        /**
         *
         * @type {SocketLock}
         * @private
         */
        this._socketLock = new SocketLock(this);
    }

    /**
     * Path to template 404
     *
     * @returns {string}
     * @constructor
     */
    static get PATH_404() {
        return 'error/404';
    }

    /**
     *
     * @returns {*}
     */
    getApp() {
        return this._app;
    }

    /**
     * Get Entity
     *
     * @param {string} name - name of Entity
     * @returns {null}
     */
    getEntity(name) {
        let collection = this._entityCollection.get();
        return collection.hasOwnProperty(name) ? collection[name] : null;
    }

    /**
     *
     * @private
     */
    _createRoutes() {

        this._routes.load((routes) => {

            this._app.use('/src', express.static(path.join(__dirname, '/../../../src')));

            for (let route of routes) {
                switch (route['method']) {
                    case 'POST':
                        this._app.post(route['route'], this._upload.array(), (req, res) => {
                            this.request = req;
                            this.response = res;
                            this.sendResponse(route);
                        });
                        break;
                    case 'GET':
                        this._app.get(route['route'], (req, res) => {
                            this.request = req;
                            this.response = res;
                            this.sendResponse(route);
                        });
                        break;
                    case 'SOCKET':
                        this._socket.listen(route['route'], route['port'], route['host']);
                        break;
                    default:
                        this._app.all(route['route'], (req, res) => {
                            this.request = req;
                            this.response = res;
                            this.sendResponse(route);
                        });
                        break;
                }
            }

            this._app.get('*', (req, res) => {
                this.request = req;
                this.response = res;
                this.responseView(Server.PATH_404, {code: 400, msg: 'The page "' + this._req.url + '" was not found.'});
            });
        });
    }

    /**
     * Check the page is locked
     *
     * @returns {boolean}
     */
    checkLock(userID) {
        for (let key in this.listActiveUsers) {
            if (this.listActiveUsers.hasOwnProperty(key) && this.listActiveUsers[key] === userID) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param {{method: string, route: string, viewPath: string}} params
     * @returns {void}
     */
    sendResponse(params) {
        if (this.security.isGranted(this._req.url, this.authorization.getSessionUserRoles())) {
            // Check the page is locked
            if (this.checkLock(this.session.setSessionUserID())) {
                let msg = 'Page is locked. Probably this page has already opened in another tab!';
                this.responseView(Server.PATH_404, {code: 423, msg: msg});
                return;
            }

            if (params.hasOwnProperty('viewPath')) {
                this.responseView(params['viewPath']);
            } else {
                this.responseController(params);
            }
        } else {
            this.responseView(Server.PATH_404, {code: 423, msg: 'Permission denied!'});
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
            this.responseView(Server.PATH_404, {code: 404, msg: 'Route configuration is not correct'});
            return this;
        }

        let method = data[1];
        let controller = data[0];

        try {
            let collection = this._controllerCollection.get();
            if (collection.hasOwnProperty(controller)) {
                collection[controller][method](this._req, this._res, params);
            }

        } catch (e) {
            console.log(e);
            this.responseView(Server.PATH_404, {
                code: 404,
                msg: 'Call to controller failed! Controller: ' + controller + '. Method: ' + method,
                detail: e
            });
        }
        return this;
    };

    /**
     * Send view to client
     *
     * @param {string} pathView - it is path to template ejs
     * @param {Object} params
     * @returns {Server}
     */
    responseView(pathView, params = {}) {
        this._res.render(pathView, params);
        return this;
    };

    /**
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

        let session = expressSession({
            secret: this.config.secret,
            resave: true,
            saveUninitialized: true
        });

        this._app.use(session);
        this._socketLock.listen();

        this._app.use(bodyParser.urlencoded({extended: false}));
        this._app.use(bodyParser.json());
        this._createRoutes();
        this._app.listen(this.config.server.port, this.config.server.host);
        return this;
    }
}

export default Server;