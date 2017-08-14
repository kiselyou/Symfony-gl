'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _expressSocket = require('express-socket.io-session');

var _expressSocket2 = _interopRequireDefault(_expressSocket);

var _Lock = require('./../../js/system/Lock');

var _Lock2 = _interopRequireDefault(_Lock);

var _SessionControls = require('./SessionControls');

var _SessionControls2 = _interopRequireDefault(_SessionControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketLock = function () {
    /**
     *
     * @param {express} app
     * @param {Array} listUsers
     */
    function SocketLock(app, listUsers) {
        _classCallCheck(this, SocketLock);

        /**
         *
         * @type {Array}
         * @private
         */
        this._listUsers = listUsers;

        this.socketServer = _http2.default.createServer(app);
    }

    /**
     *
     * @param session
     * @returns {void}
     */


    _createClass(SocketLock, [{
        key: 'listen',
        value: function listen(session) {
            var _this = this;

            var io = (0, _socket2.default)(this.socketServer);

            io.use((0, _expressSocket2.default)(session, { autoSave: true }));

            var room = io.of(_Lock2.default.NAMESPACE);

            room.on('connection', function (socket) {
                /**
                 *
                 * @type {SessionControls}
                 * @private
                 */
                _this._session = new _SessionControls2.default(socket.handshake.session);

                socket.emit(_Lock2.default.EVENT_CHECK_STATUS, { status: _this._addUserToList(_this._session) });

                socket.on('disconnect', function () {
                    _this._removeUserFromList(_this._session);
                });
            });

            this.socketServer.listen(_Lock2.default.PORT, 'localhost');
        }

        /**
         * Add user to list
         *
         * @param {SessionControls} session
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_addUserToList',
        value: function _addUserToList(session) {
            var id = session.setSessionUserID();
            if (session.isSessionUser() && this._listUsers.indexOf(id) === -1) {
                this._listUsers.push(id);
                return true;
            }
            return false;
        }

        /**
         * Remove user from list
         *
         * @param {SessionControls} session
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_removeUserFromList',
        value: function _removeUserFromList(session) {
            var key = this._listUsers.indexOf(session.setSessionUserID());
            if (key > -1) {
                this._listUsers.splice(key, 1);
                return true;
            }
            return false;
        }
    }]);

    return SocketLock;
}();

exports.default = SocketLock;