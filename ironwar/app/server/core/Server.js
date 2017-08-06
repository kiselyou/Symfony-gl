'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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

var _Socket = require('./Socket');

var _Socket2 = _interopRequireDefault(_Socket);

var _SocketLock = require('./SocketLock');

var _SocketLock2 = _interopRequireDefault(_SocketLock);

var _Routes = require('./Routes');

var _Routes2 = _interopRequireDefault(_Routes);

var _Components2 = require('./Components');

var _Components3 = _interopRequireDefault(_Components2);

var _Security = require('./security/Security');

var _Security2 = _interopRequireDefault(_Security);

var _Collection = require('../controllers/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 *
 * @type {string}
 */
var PATH_404 = 'error/404';

var Server = function (_Components) {
    _inherits(Server, _Components);

    function Server() {
        _classCallCheck(this, Server);

        /**
         * @type {express}
         * @private
         */
        var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

        _this._app = (0, _express2.default)();

        /**
         * @type {multer}
         * @private
         */
        _this._upload = (0, _multer2.default)();

        /**
         *
         * @type {Collection}
         * @private
         */
        _this._collection = new _Collection2.default(_this);

        /**
         *
         * @type {Routes}
         * @private
         */
        _this._routes = new _Routes2.default();

        /**
         *
         * @type {Socket}
         * @private
         */
        _this._socket = new _Socket2.default(_this);

        /**
         *
         * @type {Security}
         */
        _this._security = new _Security2.default(_this);

        /**
         * It is list current users in system
         *
         * @type {Array}
         */
        _this._listActiveUsers = [];

        /**
         *
         * @type {SocketLock}
         * @private
         */
        _this._socketLock = new _SocketLock2.default(_this._app, _this._listActiveUsers);
        return _this;
    }

    /**
     *
     * @returns {*}
     */


    _createClass(Server, [{
        key: 'getApp',
        value: function getApp() {
            return this._app;
        }

        /**
         *
         * @private
         */

    }, {
        key: '_createRoutes',
        value: function _createRoutes() {
            var _this2 = this;

            this._routes.load(function (routes) {

                _this2._app.use('/src', _express2.default.static(_path2.default.join(__dirname, '/../../../src')));

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var route = _step.value;

                        switch (route['method']) {
                            case 'POST':
                                _this2._app.post(route['route'], _this2._upload.array(), function (req, res) {
                                    _this2._req = req;
                                    _this2._res = res;
                                    _this2.sendResponse(route);
                                });
                                break;
                            case 'GET':
                                _this2._app.get(route['route'], function (req, res) {
                                    _this2._req = req;
                                    _this2._res = res;
                                    _this2.sendResponse(route);
                                });
                                break;
                            case 'SOCKET':
                                _this2._socket.listen(route['route'], route['port'], route['host']);
                                break;
                            default:
                                _this2._app.all(route['route'], function (req, res) {
                                    _this2._req = req;
                                    _this2._res = res;
                                    _this2.sendResponse(route);
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

                _this2._app.get('*', function (req, res) {
                    _this2._req = req;
                    _this2._res = res;
                    _this2.responseView(PATH_404, { code: 400, msg: 'The page "' + _this2._req.url + '" was not found.' });
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
            if (this._security.isGranted(this._req.url, this._security.getUserRole())) {
                if (params.hasOwnProperty('viewPath')) {
                    this.responseView(params['viewPath']);
                } else {
                    this.responseController(params);
                }
            } else {
                this.responseView(PATH_404, { code: 423, msg: 'Permission denied!' });
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
                this.responseView(PATH_404, { code: 404, msg: 'Route configuration is not correct' });
                return this;
            }

            try {
                var method = data[1];
                var controller = data[0];
                this._collection[controller][method](this.req, this.res, params);
            } catch (e) {
                this.responseView(PATH_404, { code: 404, msg: 'Route configuration is not correct' });
            }
            return this;
        }
    }, {
        key: 'responseView',


        /**
         * Send view to client
         *
         * @param {string} pathView - it is path to template ejs
         * @param {Object} params
         * @returns {Server}
         */
        value: function responseView(pathView) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this._res.render(pathView, params);
            return this;
        }
    }, {
        key: 'responseJSON',


        /**
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

            this._app.use((0, _expressSession2.default)({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
            this._app.use(_bodyParser2.default.urlencoded({ extended: false }));
            this._app.use(_bodyParser2.default.json());
            this._createRoutes();
            this._app.listen(this.config.server.port, this.config.server.host);
            this._socketLock.listen(_os2.default.hostname());
            return this;
        }
    }]);

    return Server;
}(_Components3.default);

exports.default = Server;