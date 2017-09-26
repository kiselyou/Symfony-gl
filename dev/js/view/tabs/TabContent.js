import ViewControls from '../ViewControls';

/**
 * To add content to tab you need use this class as extends inside your class
 * viewName - This is name of view from the file "js/ini/ejs.ini.js"
 *
 * @example let tab = new Tabs();
 *
 */
class TabContent extends ViewControls {
    /**
     *
     * @param {string} viewName - This ia name of your template from the file "js/ini/ejs.ini.js"
     */
    constructor(viewName) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._viewName = viewName;
    }

    /**
     * If you add this class to e.g:
     *      let tab = new Tabs();
     *          .addTab('This is tab name', true)
     *          .setContent(new ThisISYourClass('viewName'));
     * you get follow result:
     *      1. The script will call method TabContent.buildTab(content)
     *      2. variable content will have a DomElement (container of tab)
     *      3. This method build view if it was not added
     *      4. This view will added to the container after this events
     * @param {Element|UIElement|string} container
     * @returns {TabContent}
     */
    buildTab(container) {
        this
            .updateContainer(container)
            .build(this._viewName);
        return this;
    }
}

export default TabContent;