import View from './../../../view/View';
import uuidv4 from 'uuid/v4';
import {
    VIEW_NAME_INPUT_TEXT
} from './../../../ini/ejs.ini';

class FFInputText extends View {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {
        super(container);

        /**
         * @type {string}
         */
        const ID = uuidv4();

        /**
         *
         * @type {string}
         * @private
         */
        this._value = '';

        /**
         *
         * @type {string}
         * @private
         */
        this._label = '';

        /**
         *
         * @type {string}
         * @private
         */
        this._placeholder = '';

        /**
         * @type {string}
         */
        this._id = ID;

        /**
         *
         * @type {string}
         * @private
         */
        this._name = ID;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._readOnly = false;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._required = false;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._hidden = false;

        /**
         *
         * @type {string}
         * @private
         */
        this._size = FFInputText.SIZE_XS;

        /**
         *
         * @type {string}
         * @private
         */
        this._skin = '';
    }

    /**
     *
     * @returns {string}
     */
    static get SKIN_STR() {
        return 'form_skin_str';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_XS() {
        return 'form_xs';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_SM() {
        return 'form_sm';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_MD() {
        return 'form_md';
    }

    /**
     *
     * @returns {string}
     */
    static get SIZE_LG() {
        return 'form_lg';
    }

    /**
     *
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     *
     * @returns {string}
     */
    get value() {
        return this._value;
    }

    /**
     *
     * @returns {string}
     */
    get size() {
        return this._size;
    }

    /**
     *
     * @returns {string}
     */
    get label() {
        return this._label;
    }

    /**
     *
     * @returns {string}
     */
    get placeholder() {
        return this._placeholder;
    }

    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }


    /**
     *
     * @returns {string}
     */
    get skin() {
        return this._skin;
    }

    /**
     *
     * @returns {boolean}
     */
    get readOnly() {
        return this._readOnly;
    }

    /**
     *
     * @returns {boolean}
     */
    get required() {
        return this._required;
    }

    /**
     *
     * @returns {boolean}
     */
    get hidden() {
        return this._hidden;
    }

    /**
     *
     * @param {string|number} value
     * @returns {FFInputText}
     */
    setValue(value) {
        this._value = value;
        return this;
    }

    /**
     *
     * @param {string|number} value
     * @returns {FFInputText}
     */
    setSize(value) {
        this._size = value;
        return this;
    }

    /**
     *
     * @param {string|number} value
     * @returns {FFInputText}
     */
    setSkin(value) {
        this._skin = value;
        return this;
    }

    /**
     *
     * @param {string|number} value
     * @returns {FFInputText}
     */
    setLabel(value) {
        this._label = value;
        return this;
    }

    /**
     *
     * @param {string|number} value
     * @returns {FFInputText}
     */
    setPlaceholder(value) {
        this._placeholder = value;
        return this;
    }

    /**
     *
     * @param {string} value
     * @returns {FFInputText}
     */
    setName(value) {
        this._name = value;
        return this;
    }

    /**
     *
     * @param {boolean} [value]
     * @returns {FFInputText}
     */
    setReadOnly(value = true) {
        this._readOnly = value;
        return this;
    }

    /**
     *
     * @param {boolean} [value]
     * @returns {FFInputText}
     */
    setRequired(value = true) {
        this._required = value;
        return this;
    }

    /**
     *
     * @param {boolean} [value]
     * @returns {FFInputText}
     */
    setHidden(value = true) {
        this._hidden = value;
        return this;
    }

    buildField() {
        this.viewOptions = this;
        this
            .build(VIEW_NAME_INPUT_TEXT)
            .showView();
    }
}

export default FFInputText;