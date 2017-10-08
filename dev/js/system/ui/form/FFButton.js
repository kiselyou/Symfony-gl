import View from './../../../view/View';
import {
    VIEW_NAME_BUTTONS
} from './../../../ini/ejs.ini';

class FFButton extends View {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {
        super(container);

        /**
         *
         * @type {number}
         * @private
         */
        this._type = 0;

        /**
         *
         * @type {string}
         * @private
         */
        this._name = '';

        /**
         *
         * @type {string}
         * @private
         */
        this._icon = '';

        /**
         *
         * @type {string}
         * @private
         */
        this._title = '';

        /**
         *
         * @type {string}
         * @private
         */
        this._size = '';

        /**
         *
         * @type {string}
         * @private
         */
        this._link = '#';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_XS() {
        return 'btn_xs';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_SM() {
        return 'btn_SM';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_MD() {
        return 'btn_md';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_LG() {
        return 'btn_lg';
    }

    /**
     *
     * @returns {string}
     */
    static get TYPE_INFO() {
        return 'info';
    }

    /**
     *
     * @returns {string}
     */
    static get TYPE_ICON() {
        return 'icon';
    }

    /**
     *
     * @returns {string}
     */
    static get TYPE_LINK() {
        return 'link';
    }

    /**
     *
     * @returns {string}
     */
    static get TYPE_DEFAULT() {
        return 'default';
    }

    /**
     *
     * @param {string} name
     * @returns {FFButton}
     */
    setName(name) {
        this._name = name;
        return this;
    }

    /**
     *
     * @param {string} value
     * @returns {FFButton}
     */
    setLink(value) {
        this._link = value;
        return this;
    }

    /**
     *
     * @param {string} value
     * @returns {FFButton}
     */
    setIcon(value) {
        this._icon = value;
        return this;
    }

    /**
     *
     * @param {string} value
     * @returns {FFButton}
     */
    setType(value) {
        this._type = value;
        return this;
    }

    /**
     *
     * @param {string} value
     * @returns {FFButton}
     */
    setTitle(value) {
        this._title = value;
        return this;
    }

    /**
     *
     * @param {string} value
     * @returns {FFButton}
     */
    setSize(value) {
        this._size = value;
        return this;
    }

    buildBtn() {
        this._startBuild();
        return this;
    }

    /**
     *
     * @returns {void}
     * @private
     */
    _startBuild() {
        this._prepareOptions();
        this
            .build(VIEW_NAME_BUTTONS)
            .showView();
    }

    /**
     *
     * @returns {void}
     * @private
     */
    _prepareOptions() {
        this.viewOptions = {
            type: this._type,
            name: this._name,
            icon: this._icon,
            link: this._link,
            size: this._size,
            title: this._title
        };
    }
}

export default FFButton;