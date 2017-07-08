
const Controller = require('./../../core/Controller');
const IWUsers = require('./../../entity/security/IWUsers');
const IWRoles = require('./../../entity/security/IWRoles');

class SecurityController extends Controller {

    /**
     * @constructor
     * @param {Server} server
     */
    constructor(server) {
        super(server);

        this.user = new IWUsers(this.db);
        this.role = new IWRoles(this.db);
    }

    /**
     *
     * @param res
     * @param {{}} obj
     * @param {number} [status]
     * @private
     */
    static _send(res, obj, status) {
        let code = status ? status : 200;
        res.writeHead(code, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(obj));
    }

    /**
     *
     * @param req
     * @param fieldName
     * @returns {*}
     */
    getField(req, fieldName) {
        return req.body.find(function (value) {
            return value.name === fieldName;
        }).value;
    }

    /**
     *
     * @param req
     * @param res
     */
    authenticated(req, res) {
        SecurityController._send(res, {user: this.server.auth.getSessionUser(req)});
    }

    /**
     *
     * @param req
     * @param res
     */
    login(req, res) {

        if (this.server.auth.getSessionUser(req)) {
            SecurityController._send(res, {status: false, msg: 'User is authenticated'});
            return;
        }

        this._authorisation(
            (msgError, status) => {
                this.jsonResponse(res, {status: false, msg: msgError}, status);
            },
            (user, role, msg) => {
                let userID = user['id'];
                this.server.auth.createSessionUser(req, userID, role['role']);
                this.jsonResponse(res, {status: true, msg: msg, id: userID, goTo: '/home'});
            },
            this.getField(req, 'username'),
            this.getField(req, 'password')
        );
    }

    activation(req, res) {

        this.user.findByOne(
            (error) => {
                res.redirect('/');
            },
            (user) => {
                if (user) {
                    this.user.update(
                        (error) => {
                            res.redirect('/');
                        },
                        (rows) => {
                            this._authorisation(
                                (msgError, status) => {
                                    res.redirect('/');
                                },
                                (user, role, msg) => {
                                    this.server.auth.createSessionUser(req, user['id'], role['role']);
                                    res.redirect('/home');
                                },
                                user.username,
                                null,
                                true
                            );
                        },
                        {uuid: null, is_active: 1},
                        {uuid: req.query.key}
                    );
                } else {
                    res.redirect('/');
                }
            },
            {uuid: req.query.key, deleted: 0}
        );
    }

    logout(req, res) {
        this.server.auth.destroySessionUser(req);
        this.jsonResponse(res, {user: this.server.auth.getSessionUser(req)});
    }

    registration(req, res) {

        let scope = this;
        if (this.server.auth.getSessionUser(req)) {
            this.jsonResponse(res, {status: false, msg: 'User is authenticated'});
            return;
        }

        let email = this.getField(req, 'email');
        let username = this.getField(req, 'username');
        let password = this.getField(req, 'password');
        let confirmPassword = this.getField(req, 'confirm_password');

        if (password != confirmPassword) {
            this.jsonResponse(res, {status: false, msg: 'Password is not correct'});
        }

        this.user.findByOne(
            (err) => {
                this.jsonResponse(res, {status: false, msg: 'Server error'}, 500);
            },
            (user) => {
                if (user) {
                    this.jsonResponse(res, {status: false, msg: 'Username "' + username + '" already exists'});
                    return false;
                }

                var userData = {
                    email: email,
                    username: username,
                    password: scope.hashPassword(password),
                    uuid: scope.server.uuid(),
                    is_active: 0,
                    deleted: 0
                };

                this.user.insert(
                    (err) => {
                        this.jsonResponse(res, {status: false, msg: 'Server error'}, 500);
                    },
                    (userID) => {

                        this.role.findByOne(
                            (err) => {
                                this.jsonResponse(res, {status: false, msg: 'Server error'}, 500);
                            },
                            (role) => {
                                if (role) {
                                    this.jsonResponse(res, {status: false, msg: 'Cannot create user'});
                                }

                                let fields = {
                                    user_id: userID,
                                    role_id: role['id']
                                };

                                this.db.insert('iw_users_roles', fields, (err, relationID) => {
                                    if (err) {
                                        this.jsonResponse(res, {status: false, msg: 'Server error'}, 500);
                                        return;
                                    }

                                    this._sendMail(userData.email, req.headers.host, userData.uuid, (e, inf) => {
                                        console.log(e, inf);
                                    });

                                    this.server.auth.createSessionUser(req, userID, role['role']);
                                    this.jsonResponse(res, {status: true, msg: 'User successfully created', id: userID, goTo: '/home'});
                                });
                            },
                            {by_default: 1, deleted: 0}
                        );
                    }
                );
            },
            {username: username, deleted: 0}
        );
        //
        // let sql = `
        //     SELECT 1
        //       FROM iw_users
        //      WHERE ( email = ? )
        //        AND deleted = 0
        // `;
        //
        // this.db.queryRow(sql, [email], function (error, row) {
        //     if (error) {
        //         SecurityController._send(res, {status: false, msg: 'Server error'}, 500);
        //         return;
        //     }
        //
        //     if (row) {
        //         SecurityController._send(res, {status: false, msg: 'User with email address "' + email + '" already exists'});
        //         return;
        //     }
        //
        //         var userData = {
        //             email: email,
        //             username: username,
        //             password: scope.hashPassword(password),
        //             uuid: scope.server.uuid(),
        //             is_active: 0,
        //             deleted: 0
        //         };
        //
        //         scope.db.insert('iw_users', userData, function(error, userID) {
        //             if (error) {
        //                 SecurityController._send(res, {status: false, msg: 'Server error! Cannot create user'}, 500);
        //                 return;
        //             }
        //
        //             let sql = `
        //                 SELECT id,
        //                        role,
        //                        name
        //                   FROM iw_roles
        //                  WHERE by_default = 1
        //                    AND deleted = 0
        //             `;
        //
        //             scope.db.queryRow(sql, [], function (error, role) {
        //
        //                 if (error || !role) {
        //                     SecurityController._send(res, {status: false, msg: 'Server error! Cannot create user'}, 500);
        //                 }
        //
        //                 let fields = {
        //                     user_id: userID,
        //                     role_id: role['id']
        //                 };
        //
        //                 scope.db.insert('iw_users_roles', fields, function(error, relationID) {
        //
        //                     if (error) {
        //                         SecurityController._send(res, {status: false, msg: 'Server error! Cannot create relationship'}, 500);
        //                         return;
        //                     }
        //
        //                     scope._sendMail(userData.email, req.headers.host, userData.uuid, (e, inf) => {
        //                             console.log(e, inf);
        //                     });
        //
        //                     scope.server.auth.createSessionUser(req, userID, role['role']);
        //                     SecurityController._send(res, {status: true, msg: 'User successfully created', id: userID, goTo: '/home'});
        //                 });
        //             });
        //         });
        // });
    }

    _authorisation(onError, onSuccess, username, password, notCompare = false) {

        this.user.findByOne(
            (error) => {
                onError('Server error', 500);
            },
            (user) => {
                if (!user) {
                    onError('User not found', 200);
                }

                if (!notCompare && user['is_active'] === 0) {
                    onError('The profile was not activated', 200);
                    return;
                }

                if (this.server.auth.comparePassword(password, user['password']) || notCompare) {
                    this.role.findByOne(
                        (error) => {
                            onError('Server error', 500);
                        },
                        (role) => {
                            onSuccess(user, role, 'User was successfully authenticated');
                        },
                        {by_default: 1, deleted: 0}
                    );
                } else {
                    onError('Incorrect password', 200);
                }
            },
            {username: username, deleted: 0}
        );
    }

    /**
     *
     * @param {string} email
     * @param {string} host
     * @param {string} uuid
     * @param {function} callback
     * @private
     */
    _sendMail(email, host, uuid, callback) {
        let msg = `
            You was registered successfully.
            To activate the profile you need
            <a href="http://` + host + `/iw/activation?key=` + uuid + `">to click the link</a>
        `;

        this.server.mailer
            .message(email, 'Registration IronWar', null, msg)
            .send(callback);
    }
}

module.exports = SecurityController;
