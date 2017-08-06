
class SessionControls {

    /**
     *
     * @param {Object} session
     */
    constructor(session) {
        this._session = session;
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
     * @returns {SessionControls}
     */
    addSession(key, value = null) {
        this._session[key] = value;
        return this;
    }

    /**
     * Get session of user
     *
     * @returns {?Object}
     */
    getSessionUser() {
        if (this.isSessionUser()) {
            return this._session[this.KEY_USER_INFO];
        }
        return null;
    }

    /**
     * Set session
     *
     * @param {(string|number)} id
     * @param {Object} [data]
     * @returns {SessionControls}
     */
    setSessionUser(id, data = {}) {
        data['id'] = id;
        this.addSession(this.KEY_USER_INFO, data);
        return this;
    }

    /**
     * Get ID of user
     *
     * @returns {?(string|number)}
     */
    setSessionUserID() {
        let user  = this.getSessionUser();
        return user ? user['id'] : null;
    }

    /**
     *
     * @returns {boolean}
     */
    isSessionUser() {
        return (this._session && this._session[this.KEY_USER_INFO]) ? true : false;
    }

    /**
     * Remove session of user
     *
     * @returns {SessionControls}
     */
    destroySession() {
        if (this._session) {
            this._session.destroy();
        }
        return this;
    }
}

export default SessionControls;
