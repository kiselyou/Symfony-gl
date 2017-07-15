
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

        /**
         *
         * @type {IWUsers}
         */
        this.user = new IWUsers(this.db);

        /**
         *
         * @type {IWRoles}
         */
        this.role = new IWRoles(this.db);
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    authenticated(req, res) {
        this.jsonResponse(res, {user: this.server.auth.getSessionUser(req)});
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    login(req, res) {

        if (this.server.auth.getSessionUser(req)) {
            this.jsonResponse(res, {status: false, msg: 'User has already authenticated'});
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
            this.post(req, 'username'),
            this.post(req, 'password')
        );
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
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

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    logout(req, res) {
        this.server.auth.destroySessionUser(req);
        this.jsonResponse(res, {user: this.server.auth.getSessionUser(req)});
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    registration(req, res) {

        if (this.server.auth.getSessionUser(req)) {
            this.jsonResponse(res, {status: false, msg: 'User is authenticated'});
            return;
        }

        let email = this.post(req, 'email');
        let username = this.post(req, 'username');
        let password = this.post(req, 'password');
        let confirmPassword = this.post(req, 'confirm_password');

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
                                if (!role) {
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

                                    this._sendMail(userData.email, req.headers.host, userData.uuid, (err, inf) => {
                                        if (err) {
                                            this.jsonResponse(res, {status: false, msg: 'Cannot Send mail'}, 500);
                                        }
                                    });

                                    let msg = 'A message has been sent to your email to activate the subscription. Open the message and click on "Confirm subscription".';
                                    this.jsonResponse(res, {status: true, msg: msg});
                                });
                            },
                            {by_default: 1, deleted: 0}
                        );
                    },
                    userData
                );
            },
            {username: username, deleted: 0}
        );
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
    _authorisation(onError, onSuccess, username, password, notCompare = false) {

        this.user.findByOne(
            (error) => {
                onError('Server error', 500);
            },
            (user) => {
                if (!user) {
                    onError('User not found', 200);
                    return;
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
            <a href="http://` + host + `/iw/activation?key=` + uuid + `">Confirm subscription</a>
        `;

        this.server.mailer
            .message(email, 'Registration IronWar', null, msg)
            .send(callback);
    }
}

module.exports = SecurityController;
