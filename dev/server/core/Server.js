import http from 'http';
import path from 'path';
import express from 'express';
import socket from 'socket.io';
import expressSession from 'express-session';
import express_ejs_extend from 'express-ejs-extend';
import expressSessionSocket from 'express-socket.io-session';
import bodyParser from 'body-parser';
import multer from 'multer';

import Lock from './../../js/system/Lock';

import Routes from './Routes';
import Socket from './Socket';
import AppLock from './AppLock';
import MySQLConnect from './db/MySQLConnect';
import MongoDBConnect from './db/MongoDBConnect';


import Components from './Components';
import EntityCollection from '../entity/EntityCollection';
import ControllerCollection from '../controllers/ControllerCollection';
import ServerHttp from "./ServerHttp";

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
         * It is connect MsSQL
         *
         * @type {MySQLConnect}
         */
        this.db = new MySQLConnect(this.config.mysql).open();

	    /**
	     * It is connect mongodb
	     *
	     * @type {MongoDBConnect}
	     */
	    this.mongodb = new MongoDBConnect(this.config.mongodb);

        /**
         *
         * @type {EntityCollection}
         * @private
         */
        this._entityCollection = new EntityCollection(this);

        /**
         *
         * @type {ControllerCollection}
         * @private
         */
        this._controllerCollection = new ControllerCollection(this);

        /**
         *
         * @type {Routes}
         * @private
         */
        this._routes = new Routes();

        // /**
        //  *
        //  * @type {Socket}
        //  * @private
        //  */
        // this._socket = new Socket(this);

        /**
         * It is list IDs of current users in system
         *
         * @type {Object}
         */
        this.listActiveUsers = {};
	
	    /**
	     * Socket Server
	     */
	    this.ss = http.createServer(this._app);
	
	    /**
	     * Socket connect
	     */
	    this.io = socket(this.ss);
        
        /**
         *
         * @type {AppLock}
         * @private
         */
        this._appLock = new AppLock(this);
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
            this._app.use('/temp', express.static(path.join(__dirname, '/../../../temp')));

            for (let params of routes) {
	            let path = params['route'];
                switch (params['method']) {
                    case 'POST':
                        this._app.post(path, this._upload.array(), (req, res) => {
                            this.startAction(params, req, res);
                        });
                        break;
                    case 'GET':
                        this._app.get(path, (req, res) => {
                            this.startAction(params, req, res);
                        });
                        break;
                    case 'SOCKET':
                        // this._socket.listen(path, params['port'], params['host']);
                        break;
                    default:
                        this._app.all(path, (req, res) => {
                            this.startAction(params, req, res);
                        });
                        break;
                }
            }

            this._app.get('*', (req, res) => {
	            const serverHttp = new ServerHttp(req, res);
	            serverHttp.responseView(
	            	Server.PATH_404, {
	            		code: 400,
			            msg: 'The page "' + serverHttp.getCurrentUrl() + '" was not found.'
	            	}
                );
            });
        });
    }

    /**
     * Check the page is locked
     *
     * @param {string|number} userID
     * @returns {boolean} - true if the page is locked by specific user
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
     * @param {Http.Request} req
     * @param {Http.Response} res
     * @returns {void}
     */
    startAction(params, req, res) {
	    const serverHttp = new ServerHttp(req, res);
        if (this.security.isGranted(serverHttp.getCurrentUrl(), serverHttp.getSessionUserRoles())) {
            // Check the page is locked
            if (this.checkLock(serverHttp.getSessionUserID()) && !serverHttp.getXHR()) {
                let msg = 'Page is locked. Probably this page has already opened in another tab!';
	            serverHttp.responseView(Server.PATH_404, {code: 423, msg: msg});
                return;
            }

            if (params.hasOwnProperty('viewPath')) {
	            serverHttp.responseView(params['viewPath']);
            } else {
                this.callController(params, serverHttp);
            }
        } else {
	        serverHttp.responseView(Server.PATH_404, {code: 423, msg: 'Permission denied!'});
        }
    }

    /**
     * Call to controller
     *
     * @param {{method: string, route: string, viewPath: string, controller: string}} params
     * @param {ServerHttp} serverHttp
     * @returns {Server}
     */
    callController(params, serverHttp) {
        // 0 - name of controller 1 - method
        let data = params['controller'].split(':');
        if (data.length !== 2) {
	        serverHttp.responseView(Server.PATH_404, {code: 404, msg: 'Route configuration is not correct'});
            return this;
        }

        let method = data[1];
        let controller = data[0];
        try {
            let obj = this._controllerCollection.get(controller);
	        obj[method](serverHttp);
        } catch (e) {
        	console.log(e);
	        serverHttp.responseView(Server.PATH_404, {
                code: 404,
                msg: 'Call to controller failed! Controller: ' + controller + '. Method: ' + method,
                detail: e
            });
        }
        return this;
    };

    /**
     *
     * @returns {Server}
     */
    init() {
        this._app.engine('ejs', express_ejs_extend);
        this._app.set('view engine', 'ejs');
        
        let sessionMiddleware = expressSession({
            secret: this.config.secret,
            resave: true,
            saveUninitialized: true
        });
	    
	    this._app.use(sessionMiddleware);

        this._app.use(bodyParser.urlencoded({extended: false}));
        this._app.use(bodyParser.json());
		this._createRoutes();
        this._app.listen(this.config.server.port, this.config.server.host);
	
	    this.io.use(function(socket, next) {
		    sessionMiddleware(socket.request, socket.request.res, next);
	    });
	    
	    this.io.of(Lock.NAMESPACE).use(expressSessionSocket(sessionMiddleware, {
		    autoSave:true
	    }));
	
	    this._appLock.listen();
	    
	    this.ss.listen(this.config.socket.port, this.config.socket.host);
        return this;
    }
}

export default Server;
