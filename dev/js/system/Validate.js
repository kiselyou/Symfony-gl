import validator from 'validator';

class Validate {
    /**
     *
     * @param {?UIElement} blockWarning - The block where will show messages or null
     */
    constructor(blockWarning) {
        /**
         * @type {validator}
         */
        this._validator = validator;

        /**
         * The block where will show messages or null
         *
         * @type {?UIElement}
         * @private
         */
        this._blockWarning = blockWarning;

        /**
         *
         * @type {Array}
         * @private
         */
        this._rules = [];
    }

    /**
     * Rule to check email
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_IS_EMAIL() {
        return 'RULE_IS_EMAIL';
    }

    /**
     * Rule to check max value
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_MAX_LENGTH() {
        return 'RULE_MAX_LENGTH'
    }

    /**
     * Rule to check min value
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_MIN_LENGTH() {
        return 'RULE_MIN_LENGTH';
    }

    /**
     *
     * @param {string} fieldName - name of filed
     * @param {string} rule - It is constants of current class
     * @param {string|number} [mark] - It is value to need check. e.g RULE_MAX_LENGTH need set mark to 20 or some another value
     * @param {string} [message] - Message
     * @returns {Validate}
     */
    rule(fieldName, rule, mark = null, message = null) {
        this._rules.push({
            field: fieldName,
            message: message,
            rule: rule,
            mark: mark
        });
        return this;
    }

    /**
     * Check data
     *
     * @param {Object|FormData} data
     * @returns {boolean}
     */
    check(data) {
        this._validate(this._prepare(data));
        return true;
    }

    /**
     * Prepare data to validate
     *
     * @param {Object|FormData} data
     * @returns {Object}
     * @private
     */
    _prepare(data) {
        let obj = {};
        if (data instanceof FormData) {
            for (let stack of this._rules) {
                let field = stack['field'];
                if (!obj.hasOwnProperty(field)) {
                    obj[field] = data.getAll(field);
                }
            }
        } else {
            for (let field in data) {
                if (data.hasOwnProperty(field)) {
                    obj[field] = [field];
                }
            }
        }
        return obj;
    }

    _validate(data) {
        let messages = [];
        for (let stack of this._rules) {
            let mark = stack['mark'];
            let field = stack['field'];
            if (!data.hasOwnProperty(field)) {
                messages.push('Can not find field "' + field + '"');
            }

            for (let value of data[field]) {
                this._check(stack['rule']);
            }
        }
    }

    _check(rule, value) {

        switch (rule) {
            case Validate.RULE_IS_EMAIL:
                console.log(this._validator.isEmail(value));
                break;
            case Validate.RULE_MAX_LENGTH:

                break;
            case Validate.RULE_MIN_LENGTH:

                break;
        }
    }
}

export default Validate;