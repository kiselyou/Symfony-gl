
class SettingVolume {
    constructor() {

        /**
         *
         * @type {number}
         * @private
         */
        this._menu = 5;

        /**
         *
         * @type {number}
         * @private
         */
        this._tab = 20;

        /**
         *
         * @type {number}
         * @private
         */
        this._effect = 60;

        /**
         *
         * @type {number}
         * @private
         */
        this._environment = 30;

        /**
         *
         * @type {number} possible values (0|1)
         * @private
         */
        this._turnOn = 1;
    }

    /**
     * Gets values of setting
     *
     * @returns {{tab: number, menu: number, turn_on: number, effect: number, scene: number}}
     */
    getSettings() {
        return {
            tab: this.tab,
            menu: this.menu,
            turn_on: this.turnOn,
            effect: this.effect,
            environment: this.environment
        };
    }

    /**
     * Sets values of setting
     *
     * @param {{tab: number, menu: number, turn_on: number, effect: number, scene: number}} settings
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
     * @returns {number}
     */
    get menu() {
        return this._menu;
    }

    /**
     *
     * @param {number} volume
     * @returns {SettingVolume}
     */
    setTab(volume) {
        this._tab = volume;
        return this;
    }

    /**
     *
     * @returns {number}
     */
    get tab() {
        return this._tab;
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
     * @returns {number}
     */
    get effect() {
        return this._effect;
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
     * @returns {number}
     */
    get environment() {
        return this._environment;
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
     *
     * @returns {number} - possible values (0|1)
     */
    get turnOn() {
        return this._turnOn;
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