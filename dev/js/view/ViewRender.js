
import ViewControls from './ViewControls';

class ViewRender extends ViewControls {

    /**
     *
     * @param {string} viewName - It is constant.  Name of template from the file "view-path"
     * @param {Element|UIElement|string} [container] - It can be Element or selector of container
     */
    constructor(viewName, container) {
        super(container);

        /**
         *
         * @type {string}
         * @private
         */
        this._viewName = viewName;

        /**
         * There is original template EJS
         *
         * @type {?string}
         * @private
         */
        this._tmp = null;
    }

    /**
     * Gets the original template EJS
     *
     * @returns {?string}
     */
    get template() {
        return this._tmp;
    }

    /**
     * Sets the original template EJS
     *
     * @param {?string} html
     */
    set template(html) {
        return this._tmp = html;
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
        this.app.ajax.post(ViewRender.ROUTE_STR, {name: this._viewName, options: this._viewParams})
            .then((html) => {
                this.prepareElement(html);
                if (success) {
                    success(this.viewElement);
                }
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
        if (this.template) {
            this.prepareElement(this.renderEJS(this.template));
            if (success) {
                success(this.viewElement);
            }
        } else {
            this.app.ajax.post(ViewRender.ROUTE_EJS, {name: this._viewName})
                .then((res) => {
                    try {
                        let data = JSON.parse(res);
                        this.template = data['ejs'];
                        this.prepareElement(this.renderEJS(this.template));
                        if (success) {
                            success(this.viewElement);
                        }
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
}

export default ViewRender;