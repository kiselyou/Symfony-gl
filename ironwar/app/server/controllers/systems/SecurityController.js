'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controller = require('./../../core/Controller');
var IWUsers = require('./../../entity/security/IWUsers');
var IWRoles = require('./../../entity/security/IWRoles');

var SecurityController = function (_Controller) {
    _inherits(SecurityController, _Controller);

    /**
     * @constructor
     * @param {Server} server
     */
    function SecurityController(server) {
        _classCallCheck(this, SecurityController);

        /**
         *
         * @type {IWUsers}
         */
        var _this = _possibleConstructorReturn(this, (SecurityController.__proto__ || Object.getPrototypeOf(SecurityController)).call(this, server));

        _this.user = new IWUsers(_this.db);

        /**
         *
         * @type {IWRoles}
         */
        _this.role = new IWRoles(_this.db);
        return _this;
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */


    _createClass(SecurityController, [{
        key: 'authenticated',
        value: function authenticated(req, res) {
            this.jsonResponse(res, { user: this.server.auth.getSessionUser(req) });
        }

        /**
         *
         * @param req
         * @param res
         * @returns {void}
         */

    }, {
        key: 'login',
        value: function login(req, res) {
            var _this2 = this;

            if (this.server.auth.getSessionUser(req)) {
                this.jsonResponse(res, { status: false, msg: 'User has already authenticated' });
                return;
            }

            this._authorisation(function (msgError, status) {
                _this2.jsonResponse(res, { status: false, msg: msgError }, status);
            }, function (user, role, msg) {
                var userID = user['id'];
                _this2.server.auth.createSessionUser(req, userID, role['role']);
                _this2.jsonResponse(res, { status: true, msg: msg, id: userID, goTo: '/home' });
            }, this.post(req, 'username'), this.post(req, 'password'));
        }

        /**
         *
         * @param req
         * @param res
         * @returns {void}
         */

    }, {
        key: 'activation',
        value: function activation(req, res) {
            var _this3 = this;

            this.user.findByOne(function (error) {
                res.redirect('/');
            }, function (user) {
                if (user) {
                    _this3.user.update(function (error) {
                        res.redirect('/');
                    }, function (rows) {
                        _this3._authorisation(function (msgError, status) {
                            res.redirect('/');
                        }, function (user, role, msg) {
                            _this3.server.auth.createSessionUser(req, user['id'], role['role']);
                            res.redirect('/home');
                        }, user.username, null, true);
                    }, { uuid: null, is_active: 1 }, { uuid: req.query.key });
                } else {
                    res.redirect('/');
                }
            }, { uuid: req.query.key, deleted: 0 });
        }

        /**
         *
         * @param req
         * @param res
         * @returns {void}
         */

    }, {
        key: 'logout',
        value: function logout(req, res) {
            this.server.auth.destroySessionUser(req);
            this.jsonResponse(res, { user: this.server.auth.getSessionUser(req) });
        }

        /**
         *
         * @param req
         * @param res
         * @returns {void}
         */

    }, {
        key: 'registration',
        value: function registration(req, res) {
            var _this4 = this;

            if (this.server.auth.getSessionUser(req)) {
                this.jsonResponse(res, { status: false, msg: 'User is authenticated' });
                return;
            }

            var email = this.post(req, 'email');
            var username = this.post(req, 'username');
            var password = this.post(req, 'password');
            var confirmPassword = this.post(req, 'confirm_password');

            if (password != confirmPassword) {
                this.jsonResponse(res, { status: false, msg: 'Password is not correct' });
            }

            this.user.findByOne(function (err) {
                _this4.error(err);
                _this4.jsonResponse(res, { status: false, msg: 'Server error' }, 500);
            }, function (user) {
                if (user) {
                    _this4.jsonResponse(res, { status: false, msg: 'Username "' + username + '" already exists' });
                    return;
                }

                var userData = {
                    email: email,
                    username: username,
                    password: _this4.server.auth.hashPassword(password),
                    uuid: _this4.server.uuid(),
                    is_active: 0,
                    deleted: 0
                };

                _this4.user.insert(function (err) {
                    _this4.error(err);
                    _this4.jsonResponse(res, { status: false, msg: 'Server error', error: err }, 500);
                }, function (userID) {

                    _this4.role.findByOne(function (err) {
                        _this4.error(err);
                        _this4.jsonResponse(res, { status: false, msg: 'Server error' }, 500);
                    }, function (role) {
                        if (!role) {
                            _this4.jsonResponse(res, { status: false, msg: 'Cannot create user' });
                        }

                        var fields = {
                            user_id: userID,
                            role_id: role['id']
                        };

                        _this4.db.insert('iw_users_roles', fields, function (err, relationID) {
                            if (err) {
                                _this4.error(err);
                                _this4.jsonResponse(res, { status: false, msg: 'Server error' }, 500);
                                return;
                            }

                            _this4._sendMail(userData.email, req.headers.host, userData.uuid, function (err, inf) {
                                if (err) {
                                    _this4.jsonResponse(res, { status: false, msg: 'Cannot Send mail' }, 500);
                                }
                            });

                            var msg = 'A message has been sent to your email to activate the subscription. Open the message and click on "Confirm subscription".';
                            _this4.jsonResponse(res, { status: true, msg: msg });
                        });
                    }, { by_default: 1, deleted: 0 });
                }, userData);
            }, { username: username, deleted: 0 });
        }

        /**
         *
         * @param {function} onError
         * @param {function} onSuccess
         * @param {string} username
         * @param {?string} password
         * @param {boolean} [notCompare]
         * @returns {void}
         * @private
         */

    }, {
        key: '_authorisation',
        value: function _authorisation(onError, onSuccess, username, password) {
            var _this5 = this;

            var notCompare = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;


            this.user.findByOne(function (error) {
                onError('Server error', 500);
            }, function (user) {
                if (!user) {
                    onError('User not found', 200);
                    return;
                }

                if (!notCompare && user['is_active'] === 0) {
                    onError('The profile was not activated', 200);
                    return;
                }

                if (_this5.server.auth.comparePassword(password, user['password']) || notCompare) {
                    _this5.role.findByOne(function (error) {
                        onError('Server error', 500);
                    }, function (role) {
                        onSuccess(user, role, 'User was successfully authenticated');
                    }, { by_default: 1, deleted: 0 });
                } else {
                    onError('Incorrect password', 200);
                }
            }, { username: username, deleted: 0 });
        }

        /**
         *
         * @param {string} email
         * @param {string} host
         * @param {string} uuid
         * @param {function} callback
         * @private
         */

    }, {
        key: '_sendMail',
        value: function _sendMail(email, host, uuid, callback) {
            var msg = '\n            You was registered successfully.\n            To activate the profile you need\n            <a href="http://' + host + '/iw/activation?key=' + uuid + '">Confirm subscription</a>\n        ';

            this.server.mailer.message(email, 'Registration IronWar', null, msg).send(callback);
        }
    }]);

    return SecurityController;
}(Controller);

module.exports = SecurityController;