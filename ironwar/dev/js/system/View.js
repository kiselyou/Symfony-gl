
import uuidv4 from 'uuid/v4';
import Application from './Application';
import UIElement from './ui/UIElement';

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
        this.el = new UIElement();

        this.el
            .hide()
            .setNameElement(this.name);

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
                this.msg.alert('View Error', error);
            });
    }

    /**
     * Show form template
     *
     * @returns {View}
     */
    show() {
        this.el.show(true);
        return this;
    }

    /**
     * Hide form template
     *
     * @returns {View}
     */
    hide() {
        this.el.hide(true);
        return this;
    }
}

export default View;
