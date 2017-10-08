
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
            this._volume.getSetting(userID, (error, data) => {
                if (error) {
                    console.log(error);
                    this._server.responseJSON({});
                    return;
                }

                this._server.responseJSON(data ? data : {});
                return this;
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
        let userID = this._getUserID();
        if (userID) {
            this._volume.updateOrInsert(this._getDataVolume(), userID, (error, id, action) => {
                if (error) {
                    console.log(error);
                }
                this._server.responseJSON({action: action});
            });
        }
    }

    /**
     * Get data to save or update settings
     *
     * @return {Object}
     * @private
     */
    _getDataVolume() {
        let res = {};
        let data = this._server.POST;
        let boolean = ['turn_on'];
        let numbers = ['tab', 'menu', 'effect', 'environment'];
        for (let key of numbers) {
            res[key] = isNaN(Number(data[key])) ? 50 : Number(data[key]);
        }
        for (let key of boolean) {
            res[key] = data[key] === '1' ? 1 : 0;
        }
        return res;
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