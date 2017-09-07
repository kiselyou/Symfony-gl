
import {
    CLASS_ANIMATION_HIDE,
    CLASS_ANIMATION_SHOW,
    CLASS_DISABLED
} from './../../view/view-styles';

class UIElement {
    /**
     *
     * @param {Element|string} [el] - It can be Element or selector
     */
    constructor(el) {
        switch (typeof el) {
            case 'object':
                this._el = el ? el : document.createElement('div');
                break;
            case 'string':
                this._el = document.querySelector(el);
                break;
            default:
                this._el = document.createElement('div');
                break;
        }

        /**
         * Status of current element
         *  true - Is hidden
         *  false - Is shown
         *
         * @type {boolean}
         */
        this._hidden = true;
    }

    /**
     * It is value of attribute "name"
     *
     * @returns {string}
     */
    static get DATA_NAME_ELEMENT() {
        return 'data-name';
    }

    /**
     * It is value of attribute "action"
     *
     * @returns {string}
     */
    static get DATA_ACTION_ELEMENT() {
        return 'data-action';
    }

    /**
     * It is value of attribute "block"
     *
     * @returns {string}
     */
    static get DATA_BLOCK_ELEMENT() {
        return 'data-block';
    }

    /**
     *
     * @param {string} place
     * @param {UIElement|Element|string} content
     * @private
     */
    _insetAdjacent(place, content) {
        switch (typeof content) {
            case 'object':
                if (content instanceof UIElement) {
                    this.getElement().insertAdjacentElement(place, content._el);
                } else {
                    this.getElement().insertAdjacentElement(place, content);
                }
                break;
            default:
                this.getElement().insertAdjacentHTML(place, content);
                break;
        }
    }

    /**
     * Get DOM Element
     *
     * @returns {Element}
     */
    getElement() {
        return this._el;
    }

    /**
     * Clean element. Remove all children
     *
     * @returns {UIElement}
     */
    clean() {
        while (this.getElement().firstChild) {
            this.getElement().removeChild(this.getElement().firstChild);
        }
        return this;
    }

    /**
     * Find only one element
     *
     * @param {string} selector
     * @returns {?UIElement}
     */
    findOne(selector) {
        let el = this.getElement().querySelector(selector);
        return el ? new UIElement(el) : null;
    }

    /**
     * Find all element
     *
     * @param {string} selector
     * @returns {Array.<UIElement>}
     */
    findAll(selector) {
        let arr = this.getElement().querySelectorAll(selector);
        let res = [];
        if (arr) {
            for (let el of arr) {
                res.push(new UIElement(el));
            }
        }
        return res;
    }

    /**
     * Get value of element
     *
     * @returns {*}
     */
    get value() {
        let el = this.getElement();
        return this.getElement().value;
    }

    /**
     *
     * @param {UIElement|Element|string} content
     * @returns {UIElement}
     */
    beforeEnd(content) {
        this._insetAdjacent('beforeEnd', content);
        return this;
    }

    /**
     *
     * @param {UIElement|Element|string} content
     * @returns {UIElement}
     */
    beforeBegin(content) {
        this._insetAdjacent('beforeBegin', content);
        return this;
    }

    /**
     *
     * @param {UIElement|Element|string} content
     * @returns {UIElement}
     */
    afterEnd(content) {
        this._insetAdjacent('afterEnd', content);
        return this;
    }

    /**
     *
     * @param {UIElement|Element|string} content
     * @returns {UIElement}
     */
    afterBegin(content) {
        this._insetAdjacent('afterBegin', content);
        return this;
    }

    /**
     * Set block name (data-attribute) of element
     *
     * @param {string} blockName
     * @returns {UIElement}
     */
    setBlockNameElement(blockName) {
        this.getElement().setAttribute(UIElement.DATA_BLOCK_ELEMENT, blockName);
        return this;
    }

    /**
     * Get Element
     *
     * @param {string} blockName
     * @returns {UIElement}
     */
    getElementByBlockName(blockName) {
        let selector = '[' + UIElement.DATA_BLOCK_ELEMENT + '="' + blockName + '"]';
        return new UIElement(this.getElement().querySelector(selector));
    }

    /**
     * Set name (data-attribute) of element
     *
     * @param {string} name
     * @returns {UIElement}
     */
    setActionNameElement(name) {
        this.getElement().setAttribute(UIElement.DATA_ACTION_ELEMENT, name);
        return this;
    }

    /**
     * Get Element
     *
     * @param {string} name
     * @returns {UIElement}
     */
    getElementByActionName(name) {
        let selector = '[' + UIElement.DATA_ACTION_ELEMENT + '="' + name + '"]';
        return new UIElement(this.getElement().querySelector(selector));
    }

    /**
     * Set name (data-attribute) of element
     *
     * @param {string} name
     * @returns {UIElement}
     */
    setNameElement(name) {
        this.getElement().setAttribute(UIElement.DATA_NAME_ELEMENT, name);
        return this;
    }

    /**
     * Get Element
     *
     * @param {string} name
     * @returns {UIElement}
     */
    getElementByName(name) {
        let selector = '[' + UIElement.DATA_NAME_ELEMENT + '="' + name + '"]';
        return new UIElement(this.getElement().querySelector(selector));
    }

    /**
     *
     * @param {string} type
     * @param {Function} listener
     * @returns {UIElement}
     */
    addEvent(type, listener) {
        this.getElement().addEventListener(type, listener);
        return this;
    }

    /**
     * Get status of element Hide or show
     *      true - Is hidden
     *      false - Is shown
     *
     * @returns {boolean}
     */
    get isHidden() {
        return this._hidden;
    }

    /**
     * Hide element
     *
     * @param {boolean} [animate] Add animation
     * @returns {UIElement}
     */
    hide(animate = false) {
        this._hidden = true;
        if (animate) {
            this.getElement().classList.remove(CLASS_ANIMATION_SHOW);
            this.getElement().classList.add(CLASS_ANIMATION_HIDE);
        } else {
            this.getElement().hidden = true;
        }
        return this;
    }

    /**
     * Show element
     *
     * @param {boolean} [animate] Add animation
     * @returns {UIElement}
     */
    show(animate = false) {
        this._hidden = false;
        this.getElement().hidden = false;
        if (animate) {
            this.getElement().classList.remove(CLASS_ANIMATION_HIDE);
            this.getElement().classList.add(CLASS_ANIMATION_SHOW);
        }
        return this;
    }

    /**
     * Disable element. Add class and attribute "disable"
     *
     * @returns {UIElement}
     */
    disable() {
        this.getElement().classList.add(CLASS_DISABLED);
        if (!this.getElement().hasAttribute('disable')) {
            this.getElement().setAttribute('disable', 'disable');
        }
        return this;
    }

    /**
     * Enable element. Remove class and attribute "disable"
     *
     * @returns {UIElement}
     */
    enable() {
        this.getElement().classList.remove(CLASS_DISABLED);
        if (this.getElement().hasAttribute('disable')) {
            this.getElement().removeAttribute('disable');
        }
        return this;
    }

    /**
     *
     * @param {(UIElement|Element)} child
     * @returns {UIElement}
     */
    removeChild(child) {
        if (child instanceof UIElement) {
            child = child.getElement();
        }
        this.getElement().removeChild(child);
        return this;
    }
}

export default UIElement;
