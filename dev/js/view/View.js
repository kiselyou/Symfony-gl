
import ejs from 'ejs';
import uuidv4 from 'uuid/v4';
import UIElement from './../system/ui/UIElement';
import UIMainElement from './../system/ui/UIMainElement';

import ViewBuffer from './ViewBuffer';

class View {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {

        /**
         * It is name of template
         *
         * @type {string}
         */
        this._nameView = uuidv4();

        /**
         * It is element which will have templates
         *
         * @type {UIElement}
         */
        this.container = container instanceof UIElement ? container : new UIElement(container ? container : View.MAIN_CONTAINER_ID);

        /**
         * It is empty element which will have template
         *
         * @type {UIElement}
         */
        this.el = this._createElement();

        /**
         * It is blocks in the template
         *
         * @type {Object.<UIElement>}
         */
        this._blocks = {};

        /**
         * It is actions in the template
         *
         * @type {Object.<UIElement>}
         */
        this._actions = {};

        /**
         * Are params for build view
         *
         * @type {Object}
         * @private
         */
        this._viewParams = {};

        /**
         * Add to container after upload
         *
         * @type {boolean}
         */
        this._appendToContainer = true;

        /**
         * Clean container before append
         *
         * @type {boolean}
         */
        this._autoCleanContainer = false;

        /**
         * Clean element after upload new template
         *
         * @type {boolean}
         * @private
         */
        this._autoCleanElement = false;

        /**
         * @type {ejs}
         */
        this.ejs = ejs;
    }

    /**
     * It is selector of main container
     *
     * @returns {string}
     * @constructor
     */
    static get MAIN_CONTAINER_ID() {
        return UIMainElement.MAIN_CONTAINER_ID;
    }

    /**
     * Set options for view
     *
     * @param {Object} options
     */
    set viewOptions(options) {
        this._viewParams = {options: options};
    }

    /**
     * Gets options of view
     *
     * @returns {Object}
     */
    get viewOptions() {
        return this._viewParams.options;
    }

    /**
     * Gets full parameters to view.
     * This is almost the same options as is in "viewOptions" only it have parent object
     *
     * @returns {Object}
     */
    get viewParams() {
        return this._viewParams;
    }

    /**
     * Thi is template element
     *
     * @returns {UIElement|*}
     */
    get viewElement() {
        return this.el;
    }

    /**
     * Update main container
     *
     * @param {UIElement|Element|string} container - String is selector
     * @returns {View}
     */
    updateContainer(container) {
        this.container = container instanceof UIElement ? container : new UIElement(container);
        return this;
    }

    /**
     * Don't append element to container
     *
     * @param {boolean} value
     * @returns {View}
     */
    notAppendToContainer(value = false) {
        this._appendToContainer = value;
        return this;
    }

    /**
     * Clean container before append
     *
     * @param {boolean} [clean] - Default is true
     * @returns {View}
     */
    autoCleanContainer(clean = true) {
        this._autoCleanContainer = clean;
        return this;
    }

    /**
     * Clean element after upload new template
     *
     * @param {boolean} [clean] - Default is true
     * @returns {View}
     */
    autoCleanElement(clean = true) {
        this._autoCleanElement = clean;
        return this;
    }

    /**
     * Show or Hide view by value
     *
     * @param {boolean} hide
     * @param animation
     * @returns {View}
     */
    toggleShowOrHide(hide, animation = true) {
        hide ? this.hideView(animation) : this.showView(animation);
        return this;
    }

    /**
     * Show template
     *
     * @param {boolean} [animate] Add animation. Default is true
     * @returns {View}
     */
    showView(animate = true) {
        this.el.showElement(animate);
        return this;
    }

    /**
     * Hide template
     *
     * @param {boolean} [animate] Add animation. Default is true
     * @returns {View}
     */
    hideView(animate = true) {
        this.el.hideElement(animate);
        return this;
    }

    /**
     *
     * @returns {UIElement}
     */
    getView() {
        return this.el;
    }

    /**
     * Get element block by name
     *
     * @param {string|number} name - name of block
     * @returns {UIElement}
     */
    getViewBlock(name) {
        if (!this._blocks[name]) {
            this._blocks[name] = this.el.getElementByBlockName(name);
        }
        return this._blocks[name];
    }

    /**
     * Get element of action by name
     *
     * @param {string|number} name - It is name of action
     * @returns {UIElement}
     */
    getViewAction(name) {
        if (!this._actions[name]) {
            this._actions[name] = this.el.getElementByActionName(name);
        }
        return this._actions[name];
    }

    /**
     * Remove view from the page
     *
     * @returns {View}
     */
    removeView() {
        this.container.removeChild(this.el.getElement());
        this.updateElement();
        this.el = this._createElement();
        return this;
    }

    /**
     * Update element view.
     * This method clean all blocks and actions of current view
     *
     * @returns {View}
     */
    updateElement() {
        this._actions = {};
        this._blocks = {};
        return this;
    }

    /**
     *
     * @param {string|number} name
     * @returns {View}
     */
    removeViewAction(name) {
        this.getViewAction(name).remove();
        return this;
    }

    /**
     *
     * @param {string|number} name
     * @returns {View}
     */
    removeViewBlock(name) {
        this.getViewBlock(name).remove();
        return this;
    }

    /**
     * Render template EJS
     *
     * @param {string} ejsTemplate
     * @param {Object} params
     * @returns {string}
     */
    renderEJS(ejsTemplate, params) {
        return this.ejs.render(ejsTemplate, params);
    }

    /**
     * Create empty element which will have template
     *
     * @returns {UIElement}
     * @private
     */
    _createElement() {
        return new UIElement().hideElement().setNameElement(this._nameView);
    }

    /**
     * The method:
     *  Adding html to element.
     *  Paste it to container by default
     *      to controls actions look at follow methods:
     *          "this.autoCleanElement"
     *          "this.notAppendToContainer"
     *          "this.autoCleanContainer"
     *
     * @param {string} html - The HTML string of completed template
     * @returns {void}
     */
    prepareElement(html) {
        if (this._autoCleanElement) {
            this.el.clean();
        }
        this.updateElement();
        this.el.beforeEnd(html);
        if (this._appendToContainer) {
            if (this._autoCleanContainer) {
                this.container.clean();
            }
            this.container.beforeEnd(this.el);
        }
    }

    /**
     * This method compile EJS template and create dom element
     *
     * @param {string} viewName - Template name. It is constant from the file "/ini/ejs.ini.js"
     * @returns {View}
     */
    build(viewName) {
        this.prepareElement(this.getStrView(viewName));
        return this;
    }

    /**
     * This method compile EJS
     *
     * @param {string} viewName - Template name. It is constant from the file "/ini/ejs.ini.js"
     * @returns {string} - This is template as string
     */
    getStrView(viewName) {
        let template = ViewBuffer.get(viewName);
        if (template) {
            return this.renderEJS(template, this._viewParams);
        } else {
            alert('Template with name "' + viewName + '" doesn\'t exist');
        }
        return '';
    }
}

export default View;
