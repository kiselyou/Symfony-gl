import View from './../../../../view/View';
import FFDropDownItem from './FFDropDownItem';
import uuidv4 from 'uuid/v4';
import {
	VIEW_NAME_DROP_DOWN
} from './../../../../ini/ejs.ini';

class FFDropDown extends View {
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
		this._label = '';

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
		 * @type {string}
		 * @private
		 */
		this._size = FFDropDown.SIZE_XS;

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._skin = '';

		/**
		 *
		 * @type {Array.<FFDropDownItem>}
		 * @private
		 */
		this._options = [];
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
	 * @returns {Array.<FFDropDownItem>}
	 */
	get options() {
		return this._options;
	}

	/**
	 *
	 * @param {string|number} value
	 * @returns {FFDropDown}
	 */
	setSize(value) {
		this._size = value;
		return this;
	}

	/**
	 *
	 * @param {string|number} value
	 * @returns {FFDropDown}
	 */
	setSkin(value) {
		this._skin = value;
		return this;
	}

	/**
	 *
	 * @param {string|number} value
	 * @returns {FFDropDown}
	 */
	setLabel(value) {
		this._label = value;
		return this;
	}

	/**
	 *
	 * @param {string} value
	 * @returns {FFDropDown}
	 */
	setName(value) {
		this._name = value;
		return this;
	}

	/**
	 *
	 * @param {boolean} [value]
	 * @returns {FFDropDown}
	 */
	setReadOnly(value = true) {
		this._readOnly = value;
		return this;
	}

	/**
	 *
	 * @param {boolean} [value]
	 * @returns {FFDropDown}
	 */
	setRequired(value = true) {
		this._required = value;
		return this;
	}

	/**
	 *
	 * @param {string} value
	 * @param {string} text
	 * @param {boolean} [selected]
	 * @returns {FFDropDown}
	 */
	addItem(value, text, selected = false) {
		let dd = new FFDropDownItem();
		dd.set(value, text, selected);
		this._options.push(dd);
		return this;
	}

	buildField() {
		this.viewOptions = this;
		this
			.build(VIEW_NAME_DROP_DOWN)
			.showView();
	}
}

export default FFDropDown;