
class Parting {
    constructor() {
        /**
         *
         * @type {Element}
         * @private
         */
        this._el = document.createElement('div');

        // Sets html class
        this._el.classList.add('parting');
    }

    /**
     * Shows cover of parting
     *
     * @returns {void}
     */
    show() {
        document.body.innerHTML = '';
        document.body.appendChild(this._el);
    }
}

export default Parting;