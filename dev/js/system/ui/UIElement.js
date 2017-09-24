
const CLASS_ANIMATION_HIDE = 'hide_a';
const CLASS_ANIMATION_SHOW = 'show_a';
const CLASS_HIDE = 'hide';
const CLASS_DISABLED = 'disable';

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
     * Toggle HTML class
     *
     * @param {string} className
     * @returns {UIElement}
     */
    toggleClass(className) {
        this._el.classList.toggle(className);
        return this;
    }

    /**
     * Add HTML class
     *
     * @param {string} className
     * @returns {UIElement}
     */
    addClass(className) {
        this._el.classList.add(className);
        return this;
    }

    /**
     * Remove HTML class
     *
     * @param {string} className
     * @returns {UIElement}
     */
    removeClass(className) {
        this._el.classList.remove(className);
        return this;
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
     * @param {boolean} [useCapture]
     * @returns {UIElement}
     */
    addEvent(type, listener, useCapture = false) {
        this.getElement().addEventListener(type, listener, useCapture);
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
     * Show or Hide element by value
     *
     * @param {boolean} hide
     * @param animation
     * @returns {UIElement}
     */
    toggleShowOrHide(hide, animation = false) {
        hide ? this.hideElement(animation) : this.showElement(animation);
        return this;
    }

    /**
     * Hide element
     *
     * @param {boolean} [animate] Add animation
     * @returns {UIElement}
     */
    hideElement(animate = false) {
        this._hidden = true;
        if (animate) {
            this.removeClass(CLASS_HIDE);
            this.removeClass(CLASS_ANIMATION_SHOW);
            this.addClass(CLASS_ANIMATION_HIDE);
        } else {
            this.removeClass(CLASS_ANIMATION_SHOW);
            this.removeClass(CLASS_ANIMATION_HIDE);
            this.addClass(CLASS_HIDE);
        }
        return this;
    }

    /**
     * Show element
     *
     * @param {boolean} [animate] Add animation
     * @returns {UIElement}
     */
    showElement(animate = false) {
        this._hidden = false;
        if (animate) {
            this.removeClass(CLASS_HIDE);
            this.removeClass(CLASS_ANIMATION_HIDE);
            this.addClass(CLASS_ANIMATION_SHOW);
        } else {
            this.removeClass(CLASS_ANIMATION_SHOW);
            this.removeClass(CLASS_ANIMATION_HIDE);
            this.removeClass(CLASS_HIDE);
        }
        return this;
    }

    /**
     * Set attribute
     *
     * @param {string} attr
     * @param {?string} [value] - Value null means that value is the same as attribute name
     * @returns {UIElement}
     */
    addAttribute(attr, value = null) {
        this.getElement().setAttribute(attr, value ? value : attr);
        return this;
    }

    /**
     * Remove attribute
     *
     * @param {string} attr
     * @returns {UIElement}
     */
    removeAttribute(attr) {
        if (!this.getElement().hasAttribute(attr)) {
            this.getElement().removeAttribute(attr);
        }
        return this;
    }

    /**
     * Disable element. Add class and attribute "disable"
     *
     * @returns {UIElement}
     */
    disable() {
        this
            .addClass(CLASS_DISABLED)
            .addAttribute('disable');
        return this;
    }

    /**
     * Enable element. Remove class and attribute "disable"
     *
     * @returns {UIElement}
     */
    enable() {
        this
            .removeClass(CLASS_DISABLED)
            .removeAttribute('disable');
        return this;
    }

    /**
     * Remove children element
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

    /**
     * Remove this element
     *
     * @returns {UIElement}
     */
    remove() {
        let parent = this.getElement().parentElement;
        parent.removeChild(this.getElement());
        return this;
    }

    /**
     * Set text in element
     *
     * @param {string} text
     * @returns {UIElement}
     */
    setText(text) {
        this.getElement().innerHTML = text;
        return this;
    }
}

export default UIElement;
