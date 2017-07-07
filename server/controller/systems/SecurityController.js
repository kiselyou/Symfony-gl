const Authorization = require('./../../core/security/Authorization.js');

class SecurityController extends Authorization {

    /**
     * @constructor
     * @param {Server} server
     * @param {Connect} db
     */
    constructor(server, db) {
        super();
        this._db = db;
        this._server = server;
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
        SecurityController._send(res, {user: this.getSessionUser(req)});
    }

    /**
     *
     * @param req
     * @param res
     */
    login(req, res) {

        if (this.getSessionUser(req)) {
            SecurityController._send(res, {status: false, msg: 'User is authenticated'});
            return;
        }

        let username = this.getField(req, 'username');
        let password = this.getField(req, 'password');

        this._auth(req, res, username, password);
    }

    activation(req, res) {

        let sql = `
            SELECT email
              FROM iw_users
             WHERE uuid = ?
               AND deleted = 0
        `;

        this._db.queryRow(sql, [req.query.key], (error, user) => {

            if (error) {
                res.redirect('/');
            }

            if (user) {

                let updateSql = `
                    UPDATE iw_users 
                       SET uuid = ?, 
                           is_active = ? 
                     WHERE uuid = ?
                `;

                this._db.query(updateSql, [null, 1, req.query.key], (error, results) => {
                    if (error) {
                        res.redirect('/');
                    } else {
                        this._auth(req, res, user.email, null, true);
                    }
                });
            }
        });
    }

    logout(req, res) {
        this.destroySessionUser(req);
        SecurityController._send(res, {user: this.getSessionUser(req)});
    }

    registration(req, res) {

        let scope = this;
        if (this.getSessionUser(req)) {
            SecurityController._send(res, {status: false, msg: 'User is authenticated'});
            return;
        }

        let email = this.getField(req, 'email');
        let username = this.getField(req, 'username');
        let password = this.getField(req, 'password');
        let confirmPassword = this.getField(req, 'confirm_password');

        if (password != confirmPassword) {
            SecurityController._send(res, {status: false, msg: 'Password is not correct'});
        }

        let sql = `
            SELECT 1 
              FROM iw_users 
             WHERE ( email = ? )
               AND deleted = 0
        `;

        this._db.queryRow(sql, [email], function (error, row) {
            if (error) {
                SecurityController._send(res, {status: false, msg: 'Server error'}, 500);
                return;
            }

            if (row) {
                SecurityController._send(res, {status: false, msg: 'User with email address "' + email + '" already exists'});
                return;
            }

                var userData = {
                    email: email,
                    username: username,
                    password: scope.hashPassword(password),
                    uuid: scope._server.uuid(),
                    is_active: 0,
                    deleted: 0
                };

                scope._db.insert('iw_users', userData, function(error, userID) {
                    if (error) {
                        SecurityController._send(res, {status: false, msg: 'Server error! Cannot create user'}, 500);
                        return;
                    }

                    let sql = `
                        SELECT id,
                               role,
                               name
                          FROM iw_roles
                         WHERE by_default = 1
                           AND deleted = 0
                    `;

                    scope._db.queryRow(sql, [], function (error, role) {

                        if (error || !role) {
                            SecurityController._send(res, {status: false, msg: 'Server error! Cannot create user'}, 500);
                        }

                        let fields = {
                            user_id: userID,
                            role_id: role['id']
                        };

                        scope._db.insert('iw_users_roles', fields, function(error, relationID) {

                            if (error) {
                                SecurityController._send(res, {status: false, msg: 'Server error! Cannot create relationship'}, 500);
                                return;
                            }

                            scope._sendMail(userData.email, req.headers.host, userData.uuid, (e, inf) => {
                                    console.log(e, inf);
                            });

                            scope.createSessionUser(req, userID, role['role']);
                            SecurityController._send(res, {status: true, msg: 'User successfully created', id: userID, goTo: '/home'});
                        });
                    });
                });
        });
    }

    _auth(req, res, username, password, notCompare = false) {
        let sql = `
            SELECT id, 
                   username, 
                   password, 
                   email 
              FROM iw_users 
             WHERE email = ?
               AND is_active = 1
               AND deleted = 0
        `;

        this._db.queryRow(sql,
            [username],
            (err, row) => {
                if (err) {
                    SecurityController._send(res, {status: false, msg: 'Server error'}, 500);
                    return;
                }

                if (!row) {
                    SecurityController._send(res, {status: false, msg: 'User not found'});
                    return;
                }

                if (this.comparePassword(password, row['password']) || notCompare) {

                    let sql = `
                        SELECT id,
                               role,
                               name
                          FROM iw_roles
                         WHERE by_default = 1
                           AND deleted = 0
                    `;

                    this._db.queryRow(sql, [], (error, role) => {
                        if (error) {
                            SecurityController._send(res, {status: false, msg: 'Server error'}, 500);
                            return;
                        }

                        this.createSessionUser(req, row['id'], role['role']);

                        // SecurityController._send(res, {status: true, msg: 'User was successfully authenticated', id: row['id'], goTo: '/home'});
                        res.redirect('/home');
                    });

                } else {
                    SecurityController._send(res, {status: false, msg: 'Incorrect password'});
                }

            }
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

        this._server.mailer
            .message(email, 'Registration IronWar', null, msg)
            .send(callback);
    }
}

module.exports = SecurityController;
