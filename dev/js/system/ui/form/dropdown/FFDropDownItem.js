
class FFDropDownItem {
	constructor() {
		/**
		 *
		 * @type {string}
		 */
		this.value = '';

		/**
		 *
		 * @type {string}
		 */
		this.text = '';

		/**
		 *
		 * @type {boolean}
		 */
		this.selected = false;
	}

	/**
	 *
	 * @param {string} value
	 * @param {string} text
	 * @param {boolean} [selected]
	 * @returns {FFDropDownItem}
	 */
	set(value, text, selected = false) {
		this.value = value;
		this.text =text;
		this.selected = selected;
		return this;
	}
}

export default FFDropDownItem;