import path from 'path';
import multer from 'multer';
import express from 'express';
import expressSession from 'express-session';
import expressEJSExtend from 'express-ejs-extend';

import Routes from "./Routes";
import Components from './Components';
import ServerHttp from "./ServerHttp";
import MySQLConnect from "./db/MySQLConnect";
import MongoDBConnect from "./db/MongoDBConnect";
import EntityCollection from "../entity/EntityCollection";
import ControllerCollection from "../controllers/ControllerCollection";
import ServerIO from "./ServerIO";
import SocketAppLock from "./socket/SocketAppLock";

let app = express();

class Server extends Components {
	/**
	 * Possible values it are constants of class "Conf"
	 *
	 * @param {string} env (Conf.ENV_DEV|Conf.ENV_PROD)
	 */
	constructor(env) {
		super(env);
		/**
		 *
		 * @type {Routes}
		 * @private
		 */
		this._routes = new Routes();
		
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
		 * @type {ServerIO}
		 */
		this.io = new ServerIO(app, this.config.socket.port, this.config.socket.host);
		
		/**
		 * It is list IDs of current users in system
		 *
		 * @type {Object}
		 */
		this.listActiveUsers = {};
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
	_createRoutes(app) {
		this._routes.load((routes) => {
			for (let params of routes) {
				let path = params['route'];
				switch (params['method']) {
					case 'POST':
						app.post(path, multer().array(), (req, res) => {
							this.startAction(params, req, res);
						});
						break;
					case 'GET':
						app.get(path, (req, res) => {
							this.startAction(params, req, res);
						});
						break;
					case 'SOCKET':
						
						break;
					default:
						app.all(path, (req, res) => {
							this.startAction(params, req, res);
						});
						break;
				}
			}
			
			app.get('*', (req, res) => {
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
				serverHttp.responseView(
					Server.PATH_404,
					{
						code: 423,
						msg: 'Page is locked. Probably this page has already opened in another tab!'
					}
				);
				return;
			}
			
			if (params.hasOwnProperty('viewPath')) {
				serverHttp.responseView(params['viewPath']);
			} else {
				this.callController(params, serverHttp);
			}
		} else {
			serverHttp.responseView(
				Server.PATH_404,
				{
					code: 423,
					msg: 'Permission denied!'
				}
			);
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
			serverHttp.responseView(
				Server.PATH_404,
				{
					code: 404,
					msg: 'Route configuration is not correct'
				}
			);
			return this;
		}
		
		let method = data[1],
			controller = data[0];
		
		try {
			let obj = this._controllerCollection.get(controller);
			obj[method](serverHttp);
		} catch (e) {
			console.log(e);
			serverHttp.responseView(
				Server.PATH_404,
				{
					code: 404,
					msg: 'Call to controller failed! Controller: ' + controller + '. Method: ' + method,
					detail: e
				}
			);
		}
		return this;
	};
	
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
	
	init() {
		
		app.engine('ejs', expressEJSExtend);
		app.set('view engine', 'ejs');
		
		let session = expressSession({
			//TODO add store
			secret: this.config.secret,
			resave: true,
			saveUninitialized: true
		});
		
		app.use(session);
		
		app.use('/src', express.static(path.join(__dirname, '/../../../src')));
		app.use('/temp', express.static(path.join(__dirname, '/../../../temp')));
		
		this._createRoutes(app);
		
		let appLock = new SocketAppLock(this);
		appLock
			.useSession(session)
			.listen();
		
		app.listen(this.config.server.port, this.config.server.host);
		
		return this;
	}
}

export default Server;