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
	 * @param {ServerHttp} http
	 * @param {boolean} notCompare
	 * @param {function} completed
	 * @returns {void}
	 * @private
	 */
	_authorisation(http, notCompare, completed) {
		let username = http.POST['username'];
		let password = http.POST['password'];
		
		this.user.findByName(username, (error, user) => {
			if (error) {
				completed(false, 'Server error');
				return;
			}
			
			if (!user) {
				completed(false, 'User was not found');
				return;
			}
			
			if (http.comparePassword(password, user['password']) || notCompare) {
				this.role.findUserRoles(user['id'], (error, roles) => {
					if (error) {
						completed(false, 'Server error');
						return;
					}
					if (!roles) {
						completed(false, 'Cannot find role');
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
	 * @param {ServerHttp} http
	 * @returns {void}
	 */
	login(http) {
		if (http.getSessionUser()) {
			http.responseJSON({status: false, msg: 'User has already authenticated'});
			return;
		}
		
		let errors = SecurityController.validation(http.POST, false);
		
		if (errors.length > 0) {
			http.responseJSON({status: false, msg: errors});
			return;
		}
		
		this._authorisation(http, false, (status, msg, user, roles) => {
			if (status) {
				let id = user['id'];
				if (this._server.checkLock(id)) {
					http.responseJSON({status: false, msg: 'Probably your account has been opened in other browser'});
					return;
				}
				if (user['is_active'] === 1) {
					http.createSessionUser(id, roles);
					http.responseJSON({status: true, msg: msg, id: id});
				} else {
					http.responseJSON({
						status: false,
						msg: 'This account is not activated! Please look at your email and follow by link'
					});
				}
			} else {
				http.responseJSON({status: false, msg: msg});
			}
		});
	}
	
	/**
	 * Check data
	 *
	 * @param {Object} data
	 * @param {boolean} isRegistrationForm - If true Check data for form "registration" else form "login"
	 * @returns {Array}
	 */
	static validation(data, isRegistrationForm) {
		
		let username = data['username'];
		let password = data['password'];
		let errors = [];
		
		if (typeof(username) !== 'string' || username.length < 5 || username.length > 20) {
			errors.push('Username must be equal or less than 20 and more than 4 symbols');
		}
		
		if (typeof(password) !== 'string' || password.length < 6 || password.length > 20) {
			errors.push('Password must be less than 20 and more than 5 symbols');
		}
		
		if (isRegistrationForm) {
			let email = data['email'];
			let confirmPassword = data['confirm_password'];
			
			if (typeof(email) !== 'string' || email.length < 6 || email.length > 50) {
				errors.push('Email must be equal or less than 50 and more than 5 symbols');
			}
			
			if (password !== confirmPassword) {
				errors.push('Password does not match the confirm password.');
			}
		}
		
		return errors;
	}
	
	/**
	 * This method is logging user in system
	 *
	 * @param {ServerHttp} http
	 * @returns {void}
	 */
	registration(http) {
		if (http.getSessionUser()) {
			http.responseJSON({status: false, msg: 'User has already authenticated'});
			return;
		}
		
		let data = http.POST;
		let errors = SecurityController.validation(data, true);
		
		if (errors.length > 0) {
			http.responseJSON({status: false, msg: errors});
			return;
		}
		
		let email = data['email'];
		let username = data['username'];
		let password = data['password'];
		
		this.user.findByName(username, (error, user) => {
			if (error) {
				http.responseJSON({status: false, msg: 'Server error'});
				return;
			}
			
			if (user) {
				http.responseJSON({status: false, msg: 'Username "' + username + '" has already exists'});
				return;
			}
			
			let userData = {
				email: email,
				username: username,
				password: http.hashPassword(password),
				uuid: this._server.uuid(),
				is_active: 0,
				deleted: 0
			};
			
			this.user.insertRecord(userData, (error, userID) => {
				if (error) {
					http.responseJSON({status: false, msg: 'Server error'});
					return;
				}
				
				this.role.findDefaultRole((error, role) => {
					if (error) {
						http.responseJSON({status: false, msg: 'Server error'});
						return;
					}
					
					if (!role) {
						http.responseJSON({status: false, msg: 'Cannot find role by default'});
						return;
					}
					
					let dataRelationship = {
						user_id: userID,
						role_id: role['id']
					};
					
					this.role.insertRelationship(dataRelationship, (error, relationshipID) => {
						if (error) {
							http.responseJSON({status: false, msg: 'Server error'});
							return;
						}
						
						this._sendMail(http, userData.email, userData.uuid, (error) => {
							if (error) {
								this.role.deleteRelationship({id: relationshipID}, (error) => {
									if (!error) {
										this.user.deleteRecord({id: userID}, () => {
											http.responseJSON({
												status: false,
												msg: 'Probably you set not correct email. Check it and try again'
											});
										});
									}
								});
								return;
							}
							
							let msg = `
                                A message has just been sending to your email. 
                                To activate the subscription follow by link in message.
                            `;
							
							http.responseJSON({status: true, msg: msg});
						});
					});
				});
			});
		});
	}
	
	/**
	 * Send info about logged user
	 *
	 * @param {ServerHttp} http
	 * @returns {SecurityController}
	 */
	isLogged(http) {
		http.responseJSON({user: http.isSessionUser()});
		return this;
	}
	
	/**
	 * Activate profile of user and redirect to main page in anyway
	 *
	 * @param {ServerHttp} http
	 * @returns {void}
	 */
	activation(http) {
		if (http.getSessionUser()) {
			http.redirect('/');
			return;
		}
		
		let data = http.GET;
		
		this.user.findNotActive(data['key'], (error, userData) => {
			if (error) {
				http.redirect('/');
			}
			
			let updateFields = {uuid: null, is_active: 1};
			let where = {id: userData['id']};
			
			this.user.updateRecord(updateFields, where, (error) => {
				if (error) {
					http.redirect('/');
				}
				
				this._authorisation(userData, true, (status, msg, user, roles) => {
					if (status) {
						http.createSessionUser(user['id'], roles);
					}
					http.redirect('/');
				});
			});
		});
	}
	
	/**
	 * Logout user
	 *
	 * @param {ServerHttp} http
	 * @returns {SecurityController}
	 */
	logout(http) {
		http.destroySession();
		http.responseJSON({user: http.isSessionUser()});
		return this;
	}
	
	/**
	 *
	 * @param {ServerHttp} http
	 * @param {string} userEmail
	 * @param {string} uuid
	 * @param {function} [callback]
	 * @private
	 */
	_sendMail(http, userEmail, uuid, callback) {
		let msg = `
            You was registered successfully.
            To activate the profile you need follow by link
            <a href="http://` + http.host + `/iw/activation?key=` + uuid + `">Confirm subscription</a>
        `;
		
		this._server.mailer
			.html(msg)
			.send(userEmail, 'Registration IronWar', callback);
	}
}

export default SecurityController;
