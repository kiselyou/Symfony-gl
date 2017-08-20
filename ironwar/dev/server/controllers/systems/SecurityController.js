
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
                    if (user['is_active'] === 1) {
                        let id = user['id'];
                        this._server.authorization.createSessionUser(id, roles);
                        this._server.responseJSON({status: true, msg: msg, id: id});
                    } else {
                        this._server.responseJSON({status: false, msg: 'This account is not activated! Please look at your email and follow by link'});
                    }
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
            return;
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
                password: this._server.authorization.hashPassword(password),
                uuid: this._server.uuid(),
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
                        return;
                    }

                    if (!role) {
                        this._server.responseJSON({status: false, msg: 'Server error. Cannot find role by default'});
                        return;
                    }

                    let dataRelationship = {
                        user_id: userID,
                        role_id: role['id']
                    };

                    this.role.insertRelationship(dataRelationship, (error, relationshipID) => {
                        if (error) {
                            this._server.responseJSON({status: false, msg: 'Server error'});
                            return;
                        }

                        this._sendMail(userData.email, userData.uuid, (error, info) => {
                            if (error) {
                                this.role.deleteRelationship({id: relationshipID}, (error) => {
                                    if (!error) {
                                        this.user.deleteRecord({id: userID}, () => {
                                            this._server.responseJSON({status: false, msg: 'Probably you set not correct email. Check it and try again'});
                                        });
                                    }
                                });
                                return;
                            }

                            let msg = `
                                A message has just been sending to your email. 
                                To activate the subscription follow by link in message.
                            `;

                            this._server.responseJSON({status: true, msg: msg});
                        });
                    });
                });
            });
        });
    }

    /**
     * Send info about logged user
     *
     * @returns {void}
     */
    isLogged() {
        this._server.responseJSON({user: this._server.authorization.session.isSessionUser()});
    }

    /**
     * Activate profile of user and redirect to main page in anyway
     *
     * @returns {void}
     */
    activation() {

        if (this._server.authorization.getSessionUser()) {
            this._server.redirect('/');
            return;
        }

        let data = this._server.GET;

        this.user.findNotActive(data['key'], (error, userData) => {
            if (error) {
                this._server.redirect('/');
            }

            let updateFields = {uuid: null, is_active: 1};
            let where = {id: userData['id']};

            this.user.updateRecord(updateFields, where, (error) => {
                if (error) {
                    this._server.redirect('/');
                }

                this._authorisation(userData, true, (status, msg, user, roles) => {
                    if (status) {
                        this._server.authorization.createSessionUser(user['id'], roles);
                    }
                    this._server.redirect('/');
                });
            });
        });
    }

    /**
     * Logout user
     *
     * @returns {void}
     */
    logout() {
        this._server.authorization.session.destroySession();
        this._server.responseJSON({user: this._server.authorization.session.isSessionUser()});
    }

    /**
     *
     * @param {string} userEmail
     * @param {string} uuid
     * @param {function} [callback]
     * @private
     */
    _sendMail(userEmail, uuid, callback) {
        let msg = `
            You was registered successfully.
            To activate the profile you need follow by link
            <a href="http://` + this._server.host + `/iw/activation?key=` + uuid + `">Confirm subscription</a>
        `;

        this._server.mailer
            .html(msg)
            .send(userEmail, 'Registration IronWar', callback);
    }
}

export default SecurityController;
