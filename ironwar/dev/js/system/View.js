
import uuidv4 from 'uuid/v4';
import Application from './Application';
import UIElement from './ui/UIElement';
import {ACTION_DESKTOP_CLOSE} from '../view/actions.js';

class View extends Application {
    /**
     *
     * @param {string} viewPath It is path to template
     * @param {Element|HTMLElement|string} [container] - It can be Element or selector of container
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
        this.container = new UIElement(container ? container : View.MAIN_CONTAINER_ID);

        /**
         * It is uploaded template
         *
         * @type {UIElement}
         */
        this.el = new UIElement().hide().setNameElement(this.name);

        /**
         * Status of current element
         *  true - Is hidden
         *  false - Is shown
         *
         * @type {boolean}
         */
        this._hidden = true;

        /**
         * It is path to template. Possible values look at "ViewPathControls"
         *
         * @type {string}
         * @private
         */
        this._viewPath = viewPath;
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
     * Get status of current element
     *      true - Is hidden
     *      false - Is shown
     *
     * @returns {boolean}
     */
    get isHidden() {
        return this._hidden;
    }

    /**
     * @param {string} res
     * @param {boolean} status
     * @callback sendFormListener
     */

    /**
     * Send form data to server by method POST is using specific action
     *
     * @param {string} actionName - name of action
     * @param {string} path - path to the server
     * @param {string|FormData|Object} form - string is selector of form
     * @param {sendFormListener} [listener]
     */
    addActionSendForm(actionName, path, form, listener) {
        let el = this.el.getElementByActionName(actionName);
        el.addEvent('click', () => {
            let data = typeof form === 'string' ? new FormData(this.el.findOne(form).getElement()) : form;
            let ajax = this.ajax.post(path, data);
            if (listener) {
                ajax
                    .then((res) => {
                        listener(res, true);
                    })
                    .catch((error) => {
                        listener(res, false);
                    });
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
     * @param {UIElement} template
     * @callback actionUploaded
     */

    /**
     * Upload template
     *
     * @param {actionUploaded} actionUploaded
     */
    upload(actionUploaded) {
        this.ajax.post(View.ROUTE_EJS, {name: this._viewPath, params: {}})
            .then((res) => {
                this.el.beforeEnd(res);
                this.container.beforeEnd(this.el);
                actionUploaded(this.el);
            })
            .catch((error) => {
                console.log(error);
                this.msg.alert('View Error', error);
            });
    }

    /**
     * Show form template
     *
     * @returns {View}
     */
    show() {
        this._hidden = false;
        this.el.show(true);
        return this;
    }

    /**
     * Hide form template
     *
     * @returns {View}
     */
    hide() {
        this._hidden = true;
        this.el.hide(true);
        return this;
    }
}

export default View;
