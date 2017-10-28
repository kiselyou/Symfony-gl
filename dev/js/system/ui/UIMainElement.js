import UIElement from './UIElement';

let el = null;

class UIMainElement {
    constructor() {
        this._el = new UIElement(UIMainElement.MAIN_CONTAINER_ID);
    }

    /**
     *
     * @returns {UIMainElement}
     */
    static get() {
        return el || (el = new UIMainElement());
    }

    /**
     *
     * @returns {UIElement}
     */
    get container() {
        return this._el;
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
}

export default UIMainElement;