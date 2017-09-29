
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
         * @type {number}
         * @private
         */
        this._turnOn = 1;
    }

    /**
     * Gets values of setting
     *
     * @returns {{tab: number, menu: number, turnOn: number, effect: number, environment: number}}
     */
    getSettings() {
        return {
            tab: this._tab,
            menu: this._menu,
            turn_on: this._turnOn,
            effect: this._effect,
            environment: this._environment
        };
    }

    /**
     * Sets values of setting
     *
     * @param {{tab: number, menu: number, turnOn: number, effect: number, environment: number}} settings
     * @returns {SettingVolume}
     */
    setSettings(settings) {
        this.setTab(settings['tab']);
        this.setMenu(settings['menu']);
        this.setTurnOn(settings['turn_on']);
        this.setEffect(settings['effect']);
        this.setEnvironment(settings['environment']);
        return this;
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
        this._turnOn = value ? 1 : 0;
        return this;
    }

    /**
     * Sets value to the property by name
     *
     * @param {UIElement} field
     * @returns {SettingVolume}
     */
    set(field) {
        switch (field.getAttribute('name')) {
            case 'menu_volume':
                this.setMenu(field.value);
                break;
            case 'tab_volume':
                this.setTab(field.value);
                break;
            case 'effect_volume':
                this.setEffect(field.value);
                break;
            case 'environment_volume':
                this.setEnvironment(field.value);
                break;
            case 'turn_on':
                this.setTurnOn(field.value);
                break;
        }
        return this;
    }
}

export default SettingVolume;