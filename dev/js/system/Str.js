
class Str {
    /**
     *
     * @param {string} str
     */
    constructor(str) {
        /**
         *
         * @type {string}
         * @private
         */
        this._string = str;
    }

    /**
     * Set first letter to uppercase
     *
     * @returns {Str}
     */
    uppercaseFirstLetter() {
        this._string = this._string.charAt(0).toUpperCase() + this._string.slice(1).toLowerCase();
        return this;
    }

    /**
     * Set each letter to uppercase
     *
     * @returns {Str}
     */
    uppercaseEachLetter() {
        this._string = this._string.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        return this;
    }

    /**
     * Remove all symbols from string
     *
     * @param {string} symbol
     * @param {string} [to]
     * @returns {Str}
     */
    replaceSymbol(symbol, to = '') {
        let pattern = new RegExp(symbol, 'g');
        this._string = this._string.replace(pattern, to);
        return this;
    }

    /**
     * Get back modified string
     *
     * @returns {*|string}
     */
    toString() {
        return this._string;
    }
}

export default Str;