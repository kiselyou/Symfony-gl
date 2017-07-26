'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _expressEjsExtend = require('express-ejs-extend');

var _expressEjsExtend2 = _interopRequireDefault(_expressEjsExtend);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Routes = require('./Routes');

var _Routes2 = _interopRequireDefault(_Routes);

var _Collection = require('../controllers/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _Conf = require('./Conf');

var _Conf2 = _interopRequireDefault(_Conf);

var _Socket = require('./Socket');

var _Socket2 = _interopRequireDefault(_Socket);

var _Security = require('./security/Security');

var _Security2 = _interopRequireDefault(_Security);

var _Authorization = require('./security/Authorization');

var _Authorization2 = _interopRequireDefault(_Authorization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PATH_404 = 'error/404';
var PATH_423 = 'error/423';

var Server = function () {
    function Server() {
        _classCallCheck(this, Server);

        this._app = (0, _express2.default)();

        this.conf = new _Conf2.default();

        this._req = null;
        this._res = null;

        this._upload = (0, _multer2.default)();

        /**
         *
         * @type {Collection}
         * @private
         */
        this._collection = new _Collection2.default(this);

        /**
         *
         * @type {Routes}
         * @private
         */
        this._routes = new _Routes2.default();

        /**
         *
         * @type {Socket}
         * @private
         */
        this._socket = new _Socket2.default(this._app, this);

        /**
         *
         * @type {Security}
         */
        this._security = new _Security2.default(this.conf);

        /**
         *
         * @type {Authorization}
         */
        this.auth = new _Authorization2.default();
    }

    /**
     *
     * @private
     */


    _createClass(Server, [{
        key: '_createRoutes',
        value: function _createRoutes() {
            var _this = this;

            this._routes.load(function (routes) {

                // this._app.use('/dist/', express.static(path.join(__dirname, '/../../' + this.conf.pathEnvironment)));

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var route = _step.value;

                        switch (route['method']) {
                            case 'POST':
                                _this._app.post(route['route'], _this._upload.array(), function (req, res) {
                                    _this._req = req;
                                    _this._res = res;
                                    _this.sendResponse(route);
                                });
                                break;
                            case 'GET':
                                _this._app.get(route['route'], function (req, res) {
                                    _this._req = req;
                                    _this._res = res;
                                    _this.sendResponse(route);
                                });
                                break;
                            case 'SOCKET':
                                _this._socket.listen(route['route'], route['port'], route['host']);
                                break;
                            default:
                                _this._app.all(route['route'], function (req, res) {
                                    _this._req = req;
                                    _this._res = res;
                                    _this.sendResponse(route);
                                });
                                break;
                        }
                    };

                    for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                _this._app.get('*', function (req, res) {
                    _this._req = req;
                    _this._res = res;
                    _this.responseView(PATH_404, { msg: 'The page "' + _this._req.url + '" was not found.' });
                });
            });
        }

        /**
         *
         * @param {{method: string, route: string, viewPath: string}} params
         * @returns {void}
         */

    }, {
        key: 'sendResponse',
        value: function sendResponse(params) {
            if (this._security.isGranted(this._req.url, this._security.getSessionRole(this._req))) {
                if (params.hasOwnProperty('viewPath')) {
                    this.responseView(params['viewPath']);
                } else {
                    this.responseController(params);
                }
            } else {
                this.responseView(PATH_423);
            }
        }

        /**
         * Call to controller
         *
         * @param {{method: string, route: string, viewPath: string, controller: string}} params
         * @returns {Server}
         */

    }, {
        key: 'responseController',
        value: function responseController(params) {
            // 0 - name of controller 1 - method
            var data = params['controller'].split(':');

            if (data.length !== 2) {
                this.responseView(PATH_404, { msg: 'Route configuration is not correct' });
                return this;
            }

            try {
                var method = data[1];
                var controller = data[0];
                this._collection[controller][method](this.req, this.res, params);
            } catch (e) {
                this.responseView(PATH_404, { msg: 'Route configuration is not correct' });
            }
            return this;
        }
    }, {
        key: 'responseView',


        /**
         * Send view to client
         *
         * @param {string} path - it is path to template ejs
         * @param {Object} params
         * @returns {Server}
         */
        value: function responseView(path) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._res.render(path, params);
            // this._res.writeHead(200, {'Content-Type': 'text/html'});
            // this._res.end(str, 'utf-8', true);
            return this;
        }
    }, {
        key: 'responseJSON',


        /**
         *
         * Send json to client
         *
         * @param {{}|[]} data
         * @returns {Server}
         */
        value: function responseJSON(data) {
            this._res.writeHead(200, { 'Content-Type': 'application/json' });
            this._res.end(JSON.stringify(data), 'utf-8', true);
            return this;
        }
    }, {
        key: 'init',


        /**
         *
         * @returns {Server}
         */
        value: function init() {
            this._app.engine('ejs', _expressEjsExtend2.default);
            this._app.set('view engine', 'ejs');
            // this._app.set('views', path.join(__dirname, 'views'));

            this._app.use((0, _expressSession2.default)({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
            this._app.use(_bodyParser2.default.urlencoded({ extended: false }));
            this._app.use(_bodyParser2.default.json());
            this._createRoutes();
            this._app.listen(this.conf.server.port, this.conf.server.host);
            return this;
        }
    }]);

    return Server;
}();

exports.default = Server;