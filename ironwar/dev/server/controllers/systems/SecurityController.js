
class SecurityController {

    /**
     * @constructor
     * @param {Server} server
     */
    constructor(server) {

        /**
         *
         * @type {Server}
         * @private
         */
        this._server = server;

        /**
         *
         * @type {Users}
         */
        this.user = this._server.getEntity('Users');

        /**
         *
         * @type {Roles}
         */
        this.role = this._server.getEntity('Roles');
    }

    /**
     * @param {boolean} status
     * @param {?string} [msg]
     * @param {?Object} [user]
     * @param {?Object} [role]
     * @callback authorisationCompleted
     */

    /**
     *
     * @param {{username: string, password: string}} params
     * @param {boolean} notCompare
     * @param {function} completed
     * @returns {void}
     * @private
     */
    _authorisation(params, notCompare, completed) {
        let username = params['username'];
        let password = params['password'];

        this.user.findByName(username, (error, user) => {
            if (error) {
                completed(false, 'Server error');
                return;
            }

            if (!user) {
                completed(false, 'User not found');
                return;
            }

            if (this._server.authorization.comparePassword(password, user['password']) || notCompare) {
                this.role.findUserRoles(user['id'], (error, roles) => {
                    if (error) {
                        completed(false, 'Server error');
                        return;
                    }
                    if (!roles) {
                        completed(false, 'Server error. Cannot find role');
                        return;
                    }

                    completed(true, null, user, roles);
                });
            } else {
                completed(false, 'Incorrect password');
            }
        });
    }

    /**
     * This method is logging user in system
     *
     * @returns {void}
     */
    login() {
        if (this._server.authorization.getSessionUser()) {
            this._server.responseJSON({status: false, msg: 'User has already authenticated'});
            return;
        }

        this._authorisation(this._server.POST, false, (status, msg, user, roles) => {
                if (status) {
                    let id = user['id'];
                    this._server.authorization.createSessionUser(id, roles);
                    this._server.responseJSON({status: true, msg: msg, id: id});
                } else {
                    this._server.responseJSON({status: false, msg: msg});
                }
            }
        );
    }

    /**
     * This method is logging user in system
     *
     * @returns {void}
     */
    registration() {

        if (this._server.authorization.getSessionUser()) {
            this._server.responseJSON({status: false, msg: 'User has already authenticated'});
            return;
        }

        let data = this._server.POST;
        let email = data['email'];
        let username = data['username'];
        let password = data['password'];
        let confirmPassword = data['confirm_password'];

        if (password != confirmPassword) {
            this._server.responseJSON({status: false, msg: 'Password is not correct'});
        }

        this.user.findByName(username, (error, user) => {
            if (error) {
                this._server.responseJSON({status: false, msg: 'Server error'});
                return;
            }
            if (user) {
                this._server.responseJSON({status: false, msg: 'Username "' + username + '" has already exists'});
                return;
            }

            var userData = {
                email: email,
                username: username,
                password: this.server.auth.hashPassword(password),
                uuid: this.server.uuid(),
                is_active: 0,
                deleted: 0
            };

            this.user.insertRecord(userData, (error, userID) => {
                if (error) {
                    this._server.responseJSON({status: false, msg: 'Server error'});
                    return;
                }

                this.role.findDefaultRole((error, role) => {
                    if (error) {
                        this._server.responseJSON({status: false, msg: 'Server error'});
                    }
                });
            });
        });

        // let data = this._server.POST;
        // this._server.responseJSON({registration: 1, data: data});
    }

    /**
     * Send info about logged user
     *
     * @returns {void}
     */
    isLogged() {
        this._server.responseJSON({user: this._server.authorization.session.isSessionUser()});
    }
    //
    // /**
    //  *
    //  * @param req
    //  * @param res
    //  * @returns {void}
    //  */
    // activation(req, res) {
    //
    //     this.user.findByOne(
    //         (error) => {
    //             res.redirect('/');
    //         },
    //         (user) => {
    //             if (user) {
    //                 this.user.update(
    //                     (error) => {
    //                         res.redirect('/');
    //                     },
    //                     (rows) => {
    //                         this._authorisation(
    //                             (msgError, status) => {
    //                                 res.redirect('/');
    //                             },
    //                             (user, role, msg) => {
    //                                 this.server.auth.createSessionUser(req, user['id'], role['role']);
    //                                 res.redirect('/home');
    //                             },
    //                             user.username,
    //                             null,
    //                             true
    //                         );
    //                     },
    //                     {uuid: null, is_active: 1},
    //                     {uuid: req.query.key}
    //                 );
    //             } else {
    //                 res.redirect('/');
    //             }
    //         },
    //         {uuid: req.query.key, deleted: 0}
    //     );
    // }

    /**
     * Logout user
     *
     * @returns {void}
     */
    logout() {
        this._server.authorization.session.destroySession();
        this._server.responseJSON({user: this._server.authorization.session.isSessionUser()});
    }
    //
    // /**
    //  *
    //  * @param req
    //  * @param res
    //  * @returns {void}
    //  */
    // registration(req, res) {
    //
    //     if (this.server.auth.getSessionUser(req)) {
    //         this.jsonResponse(res, {status: false, msg: 'User is authenticated'});
    //         return;
    //     }
    //
    //     let email = this.post(req, 'email');
    //     let username = this.post(req, 'username');
    //     let password = this.post(req, 'password');
    //     let confirmPassword = this.post(req, 'confirm_password');
    //
    //     if (password != confirmPassword) {
    //         this.jsonResponse(res, {status: false, msg: 'Password is not correct'});
    //     }
    //
    //     this.user.findByOne(
    //         (err) => {
    //             this.error(err);
    //             this.jsonResponse(res, {status: false, msg: 'Server error'}, 500);
    //         },
    //         (user) => {
    //             if (user) {
    //                 this.jsonResponse(res, {status: false, msg: 'Username "' + username + '" already exists'});
    //                 return;
    //             }
    //
    //             var userData = {
    //                 email: email,
    //                 username: username,
    //                 password: this.server.auth.hashPassword(password),
    //                 uuid: this.server.uuid(),
    //                 is_active: 0,
    //                 deleted: 0
    //             };
    //
    //             this.user.insert(
    //                 (err) => {
    //                     this.error(err);
    //                     this.jsonResponse(res, {status: false, msg: 'Server error', error: err}, 500);
    //                 },
    //                 (userID) => {
    //
    //                     this.role.findByOne(
    //                         (err) => {
    //                             this.error(err);
    //                             this.jsonResponse(res, {status: false, msg: 'Server error'}, 500);
    //                         },
    //                         (role) => {
    //                             if (!role) {
    //                                 this.jsonResponse(res, {status: false, msg: 'Cannot create user'});
    //                             }
    //
    //                             let fields = {
    //                                 user_id: userID,
    //                                 role_id: role['id']
    //                             };
    //
    //                             this.db.insert('iw_users_roles', fields, (err, relationID) => {
    //                                 if (err) {
    //                                     this.error(err);
    //                                     this.jsonResponse(res, {status: false, msg: 'Server error'}, 500);
    //                                     return;
    //                                 }
    //
    //                                 this._sendMail(userData.email, req.headers.host, userData.uuid, (err, inf) => {
    //                                     if (err) {
    //                                         this.jsonResponse(res, {status: false, msg: 'Cannot Send mail'}, 500);
    //                                     }
    //                                 });
    //
    //                                 let msg = 'A message has been sent to your email to activate the subscription. Open the message and click on "Confirm subscription".';
    //                                 this.jsonResponse(res, {status: true, msg: msg});
    //                             });
    //                         },
    //                         {by_default: 1, deleted: 0}
    //                     );
    //                 },
    //                 userData
    //             );
    //         },
    //         {username: username, deleted: 0}
    //     );
    // }
    //
    //
    // /**
    //  *
    //  * @param {string} email
    //  * @param {string} host
    //  * @param {string} uuid
    //  * @param {function} callback
    //  * @private
    //  */
    // _sendMail(email, host, uuid, callback) {
    //     let msg = `
    //         You was registered successfully.
    //         To activate the profile you need
    //         <a href="http://` + host + `/iw/activation?key=` + uuid + `">Confirm subscription</a>
    //     `;
    //
    //     this.server.mailer
    //         .message(email, 'Registration IronWar', null, msg)
    //         .send(callback);
    // }
}

export default SecurityController;
