
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

        this.mongodb = this._server.mongodb;
    }

    /**
     * Gets settings
     *
     * @return {void}
     */
    load() {

        let userID = this._getUserID();
        if (userID) {

			this.mongodb.open((db) => {
				let d = db.collection('volume').findOne({user_id: userID});
				d.then((item) => {
					// console.log(item);
					this._server.responseJSON(item);
				});
			});

            // this._volume.getSetting(userID, (error, data) => {
            //     if (error) {
            //         console.log(error);
            //         this._server.responseJSON({});
            //         return;
            //     }
            //     console.log(data);
            //
            //     this._server.responseJSON(data ? data : {});
            // });
			return;
        }

		this._server.responseJSON({});
    }

    /**
     * Gets settings
     *
     * @return {void}
     */
    save() {
        let userID = this._getUserID();
        if (userID) {
			this.mongodb.open((db) => {
				let data = this._server.POST;
				data['user_id'] = userID;
				db.collection('volume').update({user_id: userID}, data, {upsert: true}, (err) => {
					this._server.responseJSON({action: err ? 0 : 1});
				});
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