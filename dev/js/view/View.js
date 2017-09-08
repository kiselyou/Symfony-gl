
import ejs from 'ejs';
import uuidv4 from 'uuid/v4';
import UIElement from './../system/ui/UIElement';
import ViewBuffer from './ViewBuffer';

class View extends ViewBuffer {
    /**
     *
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(container) {

        super();

        /**
         * It is name of template
         *
         * @type {v4}
         */
        this.name = uuidv4();

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
        this.appendToContainer = true;

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
        return '#initialisation_main_elements';
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
     * Get options of view
     *
     * @returns {Object}
     */
    get viewOptions() {
        return this._viewParams.options;
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
     * Show template
     *
     * @param {boolean} [animate] Add animation. Default is true
     * @returns {View}
     */
    show(animate = true) {
        this.el.show(animate);
        return this;
    }

    /**
     * Hide template
     *
     * @param {boolean} [animate] Add animation. Default is true
     * @returns {View}
     */
    hide(animate = true) {
        this.el.hide(animate);
        return this;
    }

    /**
     * Get element block by name
     *
     * @param {string} name - name of block
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
     * @param {string} name - It is name of action
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
    removeElement() {
        this.container.removeChild(this.el.getElement());
        this.el = this._createElement();
        this._actions = {};
        this._blocks = {};
        return this;
    }

    /**
     * Render template EJS
     *
     * @param {string} ejsTemplate
     * @returns {*}
     */
    renderEJS(ejsTemplate) {
        return this.ejs.render(ejsTemplate, this._viewParams);
    }

    /**
     * Create empty element which will have template
     *
     * @returns {UIElement}
     * @private
     */
    _createElement() {
        return new UIElement().hide().setNameElement(this.name);
    }

    /**
     *
     * @param {string} html - The HTML string of completed template
     * @returns {UIElement}
     */
    prepareElement(html) {
        if (this._autoCleanElement) {
            this.el.clean();
        }
        this.el.beforeEnd(html);
        if (this.appendToContainer) {
            if (this._autoCleanContainer) {
                this.container.clean();
            }
            this.container.beforeEnd(this.el);
        }
        return this.el;
    }

    /**
     *
     * @param {string} viewName - It is constant. Name of template from the file "view-path"
     * @returns {UIElement}
     */
    find(viewName) {
        let html = this.findInBuffer(viewName);
        return this.prepareElement(html);
    }
}

export default View;
