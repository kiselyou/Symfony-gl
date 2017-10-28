import uuidv4 from 'uuid/v4';

class ShaderElement {

	/**
	 *
	 * @param {string} [id]
	 */
	constructor(id) {

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._uuid = id ? id : uuidv4();

		/**
		 *
		 * @type {Element}
		 * @private
		 */
		this._el = document.createElement('script');
		this._el.type = 'application/x-glsl';
		this._el.id = this._uuid;
	}

	/**
	 *
	 * @param {string} str
	 * @returns {ShaderElement}
	 */
	set(str) {
		this._el.innerHTML = str;
		return this;
	}

	/**
	 *
	 * @returns {Element}
	 */
	getElement() {
		return this._el;
	}

	/**
	 *
	 * @returns {string}
	 */
	getContent() {
		return this._el.textContent;
	}

	/**
	 *
	 * @returns {string}
	 */
	getUUID() {
		return this._uuid;
	}
}

export default ShaderElement;