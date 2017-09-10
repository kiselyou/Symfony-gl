
class OBJController {
    /**
     *
     * @param {Server} server
     */
    constructor(server) {
        this._server = server;

        this._listLoad = {
            sss1: 'test/Wraith.obj',
            sss2: 'test2/Spaceship1.obj',
            sss3: 'test3/AIM-9 SIDEWINDER.obj'
        };
    }

    /**
     * Upload objects
     *
     * @returns {void}
     */
    load() {
        let models = {};
        try {
            models = this._server.fileLoader.getModels(this._listLoad);
        } catch (e) {
            console.log(e);
        }
        this._server.responseJSON(models);
    }
}

export default OBJController;