
import ejs from 'ejs';
import uuidv4 from 'uuid/v4';
import Application from './Application';
import UIElement from './ui/UIElement';
import Validator from './Validator';
import {ACTION_DESKTOP_CLOSE} from '../view/view-actions.js';

class View extends Application {
    /**
     *
     * @param {string} viewPath It is constant of path to template from file "view-path"
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(viewPath, container) {
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
         * It is path to template. Possible values look at "ViewPathControls"
         *
         * @type {string}
         * @private
         */
        this._pathView = viewPath;

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
         *
         * @type {Object.<Validator>}
         */
        this.validator = {};

        /**
         * There is template EJS
         *
         * @type {?string}
         * @private
         */
        this._tmp = null;

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
     * This is path to upload template and generate data in the server side
     *
     * @returns {string}
     */
    static get ROUTE_STR() {
        return '/template/str';
    };

    /**
     * This is path to upload EJE template as string from the server
     *
     * @returns {string}
     */
    static get ROUTE_EJS() {
        return '/template/ejs';
    };

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
     *
     * @param {string} actionName - name of action
     * @param {string} fieldName - name of filed
     * @param {string} rule - It is constants of class "Validator"
     * @param {?string|number|Array} [mark] - It is value to need check.
     *        In some cases this value can have array
     *        e.g.
     *           Validator.RULE_LENGTH_BETWEEN_VALUES need set mark [2, 8]. It means that value have to be more or equal 2 and less or equal 8
     *           Validator.RULE_MAX_LENGTH need set mark to 20 or some another value
     * @param {?string} [message] - Message
     * @returns {View}
     */
    addValidateRule(actionName, fieldName, rule, mark = null, message = null) {
        if (!this.validator.hasOwnProperty(actionName)) {
            this.validator[actionName] = new Validator(this.el);
        }
        this.validator[actionName].rule(fieldName, rule, mark, message);
        return this;
    }

    /**
     *
     * @param {string} actionName - name of action
     * @param {?boolean} status - true (Fields only with status true)
     *                            false (Fields only with status false)
     *                            null (Fields with any status)
     * @param {listenerCheckedField} listener
     * @returns {View}
     */
    findCheckedFields(actionName, status, listener) {
        if (this.validator.hasOwnProperty(actionName)) {
            this.validator[actionName].findCheckedFields(status, listener);
        }
        return this;
    }

    /**
     * @param {(Array|string)} res
     * @param {boolean} status
     * @returns {void}
     * @callback sendFormListener
     */

    /**
     * Send form data to server by method POST is using specific action
     *
     * @param {string} actionName - name of action
     * @param {string} path - path to the server
     * @param {string|FormData|Object} form - string is selector of form
     * @param {sendFormListener} [sendForm]
     */
    addActionSendForm(actionName, path, form, sendForm) {
        let el = this.el.getElementByActionName(actionName);
        el.addEvent('click', () => {
            let data = typeof form === 'string' ? new FormData(this.el.findOne(form).getElement()) : form;
            if (this.validator.hasOwnProperty(actionName)) {
                let validator = this.validator[actionName];
                validator.start(data);
                if (validator.isError()) {
                    sendForm(validator.getMessages(), false);
                } else {
                    this._viewAjax(path, data, sendForm);
                }
            } else {
                this._viewAjax(path, data, sendForm);
            }
        });
    }

    /**
     *
     * @param {UIElement}
     * @callback desktopClosedListener
     */

    /**
     *
     * @param {desktopClosedListener} [listener]
     * @param {boolean} close If false desktop will not close and you need custom control it
     * @returns {View}
     */
    addActionDesktopClose(listener, close = true) {
        let el = this.el.getElementByActionName(ACTION_DESKTOP_CLOSE);
        if (el) {
            el.addEvent('click', () => {
                if (listener) {
                    listener(this.el);
                }
                if (close) {
                    this.el.hide(true);
                }
            });
        }
        return this;
    }

    /**
     * @param {UIElement} - The template Element
     * @callback prepareElement
     */

    /**
     * Upload completed template from the server.
     * If your template have "extend" property you need use only this method to upload template
     *
     * @param {prepareElement} [success]
     * @returns {View}
     */
    upload(success) {
        this.ajax.post(View.ROUTE_STR, {name: this._pathView, options: this._viewParams})
            .then((html) => {
                this._prepareElement(html, success);
            })
            .catch((error) => {
                console.log(error);
                this.msg.alert('View Error', error);
            });
        return this;
    }

    /**
     * Upload EJS template from the server and compile in the client side
     * If your template don't have "extend" property you can use this method ao method "upload"
     *
     * @param {prepareElement} [success]
     * @returns {View}
     */
    render(success) {
        if (this._tmp) {
            let html = this._renderEJS(this._tmp);
            this._prepareElement(html, success);
        } else {
            this.ajax.post(View.ROUTE_EJS, {name: this._pathView})
                .then((res) => {
                    try {
                        let data = JSON.parse(res);
                        this._tmp = data['ejs'];
                        let html = this._renderEJS(this._tmp);
                        this._prepareElement(html, success);
                    } catch (error) {
                        console.log(error);
                        this.msg.alert('Load ejs Error', error);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.msg.alert('View Error', error);
                });
        }
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
     *
     * @param {string} ejsTemplate
     * @returns {*}
     * @private
     */
    _renderEJS(ejsTemplate) {
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
     * @param {prepareElement} done - The event when template is prepared
     * @returns {void}
     * @private
     */
    _prepareElement(html, done) {
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
        if (done) {
            done(this.el);
        }
    }

    /**
     * Send request to server
     *
     * @param {string} path
     * @param {Object} data
     * @param {sendFormListener} listener
     * @private
     */
    _viewAjax(path, data, listener) {
        let ajax = this.ajax.post(path, data);
        if (listener) {
            ajax
                .then((res) => {
                    listener(res, true);
                })
                .catch((error) => {
                    listener(error, false);
                });
        }
    }
}

export default View;
