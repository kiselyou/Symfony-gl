import User from './../user/User';

class Sound {

    constructor() {

        /**
         *
         * @type {HTMLElement}
         */
        this.container = document.body;

        /**
         *
         * @type {User}
         * @private
         */
        this._user = User.get();

        /**
         *
         * @type {number}
         */
        this.volume = 0.05;
    }

    /**
     *
     * @param {string} source
     * @param {number} [volume] - possible values [0 - 1]
     * @returns {Sound}
     */
    play(source, volume) {
        let setting = this._user.getSettingVolume();
        if (setting.turnOn === 0) {
            return this;
        }

        let audio = new Audio(source);
        audio.volume = volume ? volume : this.volume;
        audio.play();
        return this;
    }

    /**
     *
     * @param {string} source
     * @returns {Sound}
     */
    playTab(source) {
        let setting = this._user.getSettingVolume();
        this.play(source, setting.tab / 100);
        return this;
    }

    /**
     *
     * @param {string} source
     * @returns {Sound}
     */
    playMenu(source) {
        let setting = this._user.getSettingVolume();
        this.play(source, setting.menu / 100);
        return this;
    }

    /**
     *
     * @param {string} source
     * @returns {Sound}
     */
    playEffect(source) {
        let setting = this._user.getSettingVolume();
        this.play(source, setting.effect / 100);
        return this;
    }

    /**
     *
     * @param {string} source
     * @returns {Sound}
     */
    playEnvironment(source) {
        let setting = this._user.getSettingVolume();
        this.play(source, setting.environment / 100);
        return this;
    }
}

export default Sound;