
class Session {

    /**
     *
     * @param {Object} [session]
     */
    constructor(session) {
        /**
         *
         * @type {Object}
         * @private
         */
        this._userSession = session ? session : {};
        
        
        // console.log(this._userSession);
    }

    /**
     *
     * @param {Object} session
     */
    update(session) {
        this._userSession = session ? session : {};
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get KEY_USER_INFO() {
        return 'session_user_info';
    }

    /**
     *
     * @param {(string|number)} key
     * @param {*} [value]
     * @returns {Session}
     */
    addSession(key, value = null) {
        this._userSession[key] = value;
        // this._userSession.save(function (err) {
	     //    console.log(err, "+++================");
        // });
        return this;
    }

    /**
     * Get session of user
     *
     * @returns {?Object}
     */
    getSessionUser() {
        if (this.isSessionUser()) {
            return this._userSession[Session.KEY_USER_INFO];
        }
        return null;
    }

    /**
     * Set session
     *
     * @param {(string|number)} id
     * @param {Object} [data]
     * @returns {Session}
     */
    setSessionUser(id, data = {}) {
        data['id'] = id;
        this.addSession(Session.KEY_USER_INFO, data);
        return this;
    }

    /**
     * Get ID of user
     *
     * @returns {?(string|number)}
     */
    getSessionUserID() {
        let user  = this.getSessionUser();
        return user ? user['id'] : null;
    }

    /**
     *
     * @returns {boolean}
     */
    isSessionUser() {
        return (this._userSession && this._userSession[Session.KEY_USER_INFO]);
    }

    /**
     * Remove session of user
     *
     * @returns {Session}
     */
    destroySession() {
        if (this._userSession) {
            this._userSession.destroy();
            delete this._userSession[Session.KEY_USER_INFO];
        }
        return this;
    }
}

export default Session;
