
class UIElement {
    /**
     *
     * @param {Element|string} [el] - It can be Element or selector
     */
    constructor(el) {
        switch (typeof el) {
            case 'object':
                this._el = el;
                break;
            case 'string':
                this._el = document.body.querySelector(el);
                break;
            default:
                this._el = document.createElement('div');
                break;
        }
    }

    /**
     *
     * @returns {string}
     */
    static get DATA_NAME_ELEMENT() {
        return 'data-name';
    }

    /**
     *
     * @returns {string}
     */
    static get DATA_ACTION_ELEMENT() {
        return 'data-action';
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
                    this._el.insertAdjacentElement(place, content._el);
                } else {
                    this._el.insertAdjacentElement(place, content);
                }
                break;
            default:
                this._el.insertAdjacentHTML(place, content);
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
     * Find only one element
     *
     * @param {string} selector
     * @returns {UIElement}
     */
    findOne(selector) {
        return new UIElement(this._el.querySelector(selector));
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
     * Set name (data-attribute) of element
     *
     * @param {string} name
     * @returns {UIElement}
     */
    setActionNameElement(name) {
        this._el.setAttribute(UIElement.DATA_ACTION_ELEMENT, name);
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
        return new UIElement(this._el.querySelector(selector));
    }

    /**
     * Set name (data-attribute) of element
     *
     * @param {string} name
     * @returns {UIElement}
     */
    setNameElement(name) {
        this._el.setAttribute(UIElement.DATA_NAME_ELEMENT, name);
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
        return new UIElement(this._el.querySelector(selector));
    }

    /**
     *
     * @param {string} type
     * @param {Function} listener
     * @returns {UIElement}
     */
    addEvent(type, listener) {
        this._el.addEventListener(type, listener);
        return this;
    }

    /**
     * Hide element
     *
     * @param {boolean} [animate] Add animation
     * @returns {UIElement}
     */
    hide(animate = false) {
        if (animate) {
            this._el.classList.remove('show_a');
            this._el.classList.add('hide_a');
        } else {
            this._el.hidden = true;
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
        this._el.hidden = false;
        if (animate) {
            this._el.classList.remove('hide_a');
            this._el.classList.add('show_a');
        }
        return this;
    }
}

export default UIElement;
