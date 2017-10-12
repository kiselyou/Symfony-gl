import uuidv4 from 'uuid/v4';
import ShaderElement from './ShaderElement';

let shaderInst = null;

class Shader {
	constructor() {

		/**
		 * @type {string}
		 */
		this._uuidContainer = uuidv4();

		/**
		 *
		 * @type {Element}
		 * @private
		 */
		this._container = document.createElement('div');
		this._container.id = this._uuidContainer;

		/**
		 *
		 * @type {Array.<ShaderElement>}
		 * @private
		 */
		this._shaders = [];
	}

	/**
	 *
	 * @returns {Shader}
	 */
	static get() {
		return shaderInst || (shaderInst = new Shader());
	}

	/**
	 * Add shader to page
	 *
	 * @param {string} str
	 * @param {string} [id]
	 * @returns {ShaderElement}
	 */
	add(str, id) {
		let shader = new ShaderElement(id);
		shader.set(str);
		this._shaders.push(shader);
		return shader;
	}

	/**
	 *
	 * @param {string} id
	 * @returns {Shader}
	 */
	remove(id) {
		for (let i = 0; i < this._shaders.length; i++) {
			let el = this._shaders[i];
			if (el.getUUID() === id) {
				this._shaders.splice(i, 1);
				this._container.removeChild(el.getElement());
				break;
			}
		}
		return this;
	}
}

export default Shader;