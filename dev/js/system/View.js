
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
         * It is uploaded template
         *
         * @type {UIElement}
         */
        this.el = new UIElement().hide().setNameElement(this.name);

        /**
         * It is path to template. Possible values look at "ViewPathControls"
         *
         * @type {string}
         * @private
         */
        this._viewPath = viewPath;

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
     * It is path to controller EJS
     *
     * @returns {string}
     * @constructor
     */
    static get ROUTE_EJS() {
        return '/ejs';
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
     * @param {UIElement} template
     * @callback actionUploaded
     */

    /**
     * Upload template
     *
     * @param {actionUploaded} [actionUploaded]
     * @returns {View}
     */
    upload(actionUploaded) {
        this.ajax.post(View.ROUTE_EJS, {name: this._viewPath, options: this._viewParams})
            .then((res) => {
                if (this._autoCleanElement) {
                    this.el.clean();
                }
                this.el.beforeEnd(res);
                if (this.appendToContainer) {
                    if (this._autoCleanContainer) {
                        this.container.clean();
                    }
                    this.container.beforeEnd(this.el);
                }

                if (actionUploaded) {
                    actionUploaded(this.el);
                }
            })
            .catch((error) => {
                console.log(error);
                this.msg.alert('View Error', error);
            });
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
}

export default View;
