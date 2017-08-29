import validator from 'validator';

class Validator {
    /**
     *
     * @param {UIElement} [blockWarning] - The block where will show messages
     */
    constructor(blockWarning) {
        /**
         * @type {validator}
         */
        this._validator = validator;

        /**
         * The block where will show messages or null
         *
         * @type {UIElement}
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
     * @returns {Validator}
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
     * Start check data
     *
     * @param {Object|FormData} data
     * @returns {Array}
     */
    start(data) {
        let params = this._prepare(data);
        return this._validate(params);
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

    /**
     *
     * @param {Object} data
     * @returns {Array}
     * @private
     */
    _validate(data) {
        let messages = [];
        for (let stack of this._rules) {
            let mark = stack['mark'];
            let field = stack['field'];
            if (!data.hasOwnProperty(field)) {
                messages.push('Can not find field "' + field + '"');
            }

            for (let value of data[field]) {
                messages = this._performRule(stack['rule'], value);
            }
        }
        return messages;
    }

    /**
     * Perform rule. Check data that value is goal
     *
     * @param {string} rule
     * @param {string|number} value
     * @returns {*}
     * @private
     */
    _performRule(rule, value) {

        switch (rule) {
            case Validator.RULE_IS_EMAIL:
                return this._validator.isEmail(value) + ' +++|';
                break;
            case Validator.RULE_MAX_LENGTH:
                return 'max';
                break;
            case Validator.RULE_MIN_LENGTH:
                return 'min';
                break;
        }
    }
}

export default Validator;