
class SettingVolume {
    constructor() {

        /**
         *
         * @type {number}
         * @private
         */
        this._menu = 50;

        /**
         *
         * @type {number}
         * @private
         */
        this._tab = 50;

        /**
         *
         * @type {number}
         * @private
         */
        this._effect = 50;

        /**
         *
         * @type {number}
         * @private
         */
        this._environment = 50;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._turnOn = true;
    }

    /**
     *
     * @return {number}
     */
    get menu() {
        return this._menu;
    }

    /**
     *
     * @return {number}
     */
    get tab() {
        return this._tab;
    }

    /**
     *
     * @return {number}
     */
    get effect() {
        return this._effect;
    }

    /**
     *
     * @return {number}
     */
    get environment() {
        return this._environment;
    }

    /**
     *
     * @return {boolean}
     */
    get turnOn() {
        return this._turnOn;
    }

    /**
     *
     * @param {number} volume
     * @returns {SettingVolume}
     */
    setMenu(volume) {
        this._menu = volume;
        return this;
    }

    /**
     *
     * @param {number} volume
     * @returns {SettingVolume}
     */
    setTab(volume) {
        this._tab = volume;
        return this
    }

    /**
     *
     * @param {number} volume
     * @returns {SettingVolume}
     */
    setEffect(volume) {
        this._effect = volume;
        return this;
    }

    /**
     *
     * @param {number} volume
     * @returns {SettingVolume}
     */
    setEnvironment(volume) {
        this._environment = volume;
        return this;
    }

    /**
     *
     * @param {boolean} value
     * @returns {SettingVolume}
     */
    setTurnOn(value) {
        this._turnOn = value;
        return this;
    }
}

export default SettingVolume;