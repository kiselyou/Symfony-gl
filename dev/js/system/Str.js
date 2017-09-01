
class Str {
    /**
     * Set first letter to uppercase
     *
     * @param {string} str
     * @returns {string}
     */
    static uppercaseFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

export default Str;