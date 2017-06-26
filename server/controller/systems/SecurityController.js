const Authorization = require('./../../core/Authorization.js');

class SecurityController extends Authorization {

    constructor(db, config) {
        super();
        this._db = db;
        this._server = config;
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
    login(req, res) {

        if (this.getSessionUser(req)) {
            SecurityController._send(res, {status: false, msg: 'User is authenticated'});
            return;
        }

        let username = this.getField(req, 'username');
        let password = this.getField(req, 'password');

        let sql = `
            SELECT id, username, password, email 
              FROM iw_users 
             WHERE ( email = ? OR username = ? )
               AND is_active = 1
               AND deleted = 0
        `;

        let scope = this;
        this._db.queryRow(sql,
            [username, username],
            function (err, row) {
                if (err) {
                    SecurityController._send(res, {status: false, msg: 'Server error'}, 500);
                    return;
                }

                if (!row) {
                    SecurityController._send(res, {status: false, msg: 'User not found'});
                    return;
                }

                scope.comparePassword(password, row['password'], function(err, match) {
                    if (match) {
                        scope.createSessionUser(req, row);
                        SecurityController._send(res, {status: true, msg: 'User was successfully authenticated', id: row['id'], goTo: '/home'});
                    } else {
                        SecurityController._send(res, {status: false, msg: 'Incorrect password'});
                    }
                });

            }
        );
    }

    logout(req, res) {
        this.destroySessionUser(req);
        req.writeHead(302, {'Location': '/login'});
        req.end();
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

            scope.cryptPassword(password, function(error, passwordHash) {
                if (error) {
                    SecurityController._send(res, {status: false, msg: 'Server error! Cannot crypt password'}, 500);
                    return;
                }

                var userData = {
                    email: email,
                    username: username,
                    password: passwordHash,
                    is_active: 1,
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

                        let fields = {
                            user_id: userID,
                            role_id: role['id']
                        };

                        scope._db.insert('iw_users_roles', fields, function(error, relationID) {

                            if (error) {
                                SecurityController._send(res, {status: false, msg: 'Server error! Cannot create relationship'}, 500);
                                return;
                            }

                            userData['role'] = role;
                            scope.createSessionUser(req, userData);
                            SecurityController._send(res, {status: true, msg: 'User successfully created', id: userID, goTo: '/home'});
                        });
                    });
                });
            });
        });
    }
}

module.exports = SecurityController;
