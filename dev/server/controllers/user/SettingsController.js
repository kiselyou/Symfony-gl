
class SettingsController {
    /**
     *
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
         * @type {Volume}
         * @private
         */
        this._volume = this._server.getEntity('Volume');
    }

    /**
     * Gets settings
     *
     * @return {void}
     */
    load() {
        let userID = this._getUserID();
        if (userID) {
            this._volume.getUserSettingVolume(userID, (error, data) => {
                if (error) {
                    console.log(error);
                    this._server.responseJSON({});
                    return;
                }

                this._server.responseJSON(data ? data : {});
            });
        } else {
            this._server.responseJSON({});
        }
    }

    /**
     * Gets settings
     *
     * @return {void}
     */
    save() {
        this._server.responseJSON({save: true});
    }

    /**
     * Gets ID of user
     *
     * @returns {?number}
     * @private
     */
    _getUserID() {
        if (this._server.authorization.getSessionUser()) {
            let user = this._server.authorization.getSessionUser();
            return user['id'];
        }
        return null;
    }
}

export default SettingsController;