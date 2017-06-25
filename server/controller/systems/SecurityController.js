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

    /**
     *
     * @param req
     * @param res
     */
    login(req, res) {

        let username = req.body.find(function (value) {
            return value.name === 'username';
        }).value;

        let password = req.body.find(function (value) {
            return value.name === 'password';
        }).value;

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
                    SecurityController._send(res, {status: true, msg: 'User not found'});
                    return;
                }

                scope.comparePassword(password, row['password'], function(err, match) {
                    let msg = null;
                    if (match) {
                        this.createSessionUser(req, row);
                        msg = 'User was successfully authenticated';
                    } else {
                        msg = 'Incorrect password';
                    }

                    SecurityController._send(res, {status: true, msg: msg});
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

        // var inst = this;
        // if (req.session.user !== undefined) {
        //     inst._sendResponse(res, 'Server error! User is authenticated', null, 201);
        //     return false;
        // }
        // if (req.body.sw_password != req.body.sw_repeat_password) {
        //     inst._sendResponse(res, 'Password not correct', null, 201);
        // }
        // inst.User.findByEmail(req.body.sw_email, function (error, row) {
        //     if (error) {
        //         inst._sendResponse(res, 'Server error!', null, 500);
        //         return false;
        //     } else {
        //         if (row) {
        //             inst._sendResponse(res, 'User with address "' + req.body.sw_email + '" already exists', null, 201);
        //             return false;
        //         }
        //     }
        //
        //     var auth = new inst.Authorization();
        //     auth.cryptPassword(req.body.sw_password, function(err, hash) {
        //         if (err) {
        //             inst._sendResponse(res, 'Server error! Cannot crypt', null, 500);
        //             return false;
        //         }
        //
        //         var fields = {
        //             username: req.body.sw_username,
        //             email: req.body.sw_email,
        //             password: hash,
        //             role: inst._config.role_registration
        //         };
        //
        //         inst.User.createRecord(fields, function (err, id) {
        //             if (err) {
        //                 inst._sendResponse(res, 'Server error! Cannot create user', null, 500);
        //                 return false;
        //             }
        //
        //             inst.User.findByEmail(req.body.sw_email, function (err, row) {
        //                 if (err) {
        //                     inst._sendResponse(res, 'Server error! Error find user', null, 500);
        //                     return false;
        //                 }
        //
        //                 if (!row) {
        //                     inst._sendResponse(res, 'Server error! User not found', null, 201);
        //                     return false;
        //                 }
        //
        //                 auth._createSessionUser(req, row);
        //                 inst._sendResponse(res, 'User successfully created', id, 200);
        //                 return true;
        //                 // res.writeHead(302, {'Location': '/'});
        //                 // res.end();
        //             });
        //         });
        //     });
        // });


        SecurityController._send(res, {});
    }
}

module.exports = SecurityController;
