
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import equals from 'validator/lib/equals';

import UIElement from './ui/UIElement';

class Validator {
    /**
     *
     * @param {?string} [controlsAria] - It is element to controls validation e.g. Check if field has the same value as field by name
     */
    constructor(controlsAria) {

        /**
         *
         * @type {Array}
         * @private
         */
        this._rules = [];

        /**
         * @type {UIElement}
         * @private
         */
        this._aria = new UIElement(controlsAria ? controlsAria : document.body);

        /**
         *
         * @type {Array}
         */
        this.messages = [];
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
     * Rule to check range between values
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_RANGE_VALUES() {
        return 'RULE_RANGE_VALUES';
    }

    /**
     * Rule to check range between values of fields
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_RANGE_FIELDS() {
        return 'RULE_RANGE_FIELDS';
    }

    /**
     * Rule to check if value is equal value of field
     * The value of field must be equal to the value of third of parameters. It is or UIElement or string (name of field on page)
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_EQUAL_VALUE() {
        return 'RULE_EQUAL_VALUE';
    }

    /**
     * Rule to check if value is equal value
     * The value of field must be equal the third of parameters
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_EQUAL_BY_FIELD_NAME() {
        return 'RULE_EQUAL_BY_FIELD_NAME';
    }

    /**
     *
     * @param {string} fieldName - name of filed
     * @param {string} rule - It is constants of current class
     * @param {?string|number} [mark] - It is value to need check. e.g RULE_MAX_LENGTH need set mark to 20 or some another value
     * @param {?string} [message] - Message
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
     * @returns {boolean}
     */
    start(data) {
        this._clean();
        let params = {};
        if (data instanceof FormData) {
            params = this._prepareFormData(data);
        }
        this._validate(params);
        return this.isError();
    }

    /**
     * Prepare Form Data to validate
     *
     * @param {FormData} data
     * @returns {Object.<Array>}
     * @private
     */
    _prepareFormData(data) {
        let result = {};
        if (data instanceof FormData) {
            for (let rule of this._rules) {
                let field = rule['field'];
                if (!result.hasOwnProperty(field)) {
                    result[field] = data.getAll(field);
                } else {
                    result[field].push(data.get(field));
                }
            }
        }
        return result;
    }

    /**
     * Clean
     *
     * @private
     */
    _clean() {
        this.messages = [];
    }

    /**
     * Check status of validation
     *
     * @returns {boolean}
     */
    isError() {
        return this.messages.length > 0;
    }

    /**
     * Get messages
     *
     * @returns {Array}
     */
    getMessages() {
        return this.messages;
    }

    /**
     *
     * @param {Object} data
     * @returns {void}
     * @private
     */
    _validate(data) {
        for (let rule of this._rules) {
            let field = rule['field'];
            if (!data.hasOwnProperty(field)) {
                this.messages.push('Can not find field "' + field + '"');
            }

            for (let value of data[field]) {
                let status = this._performRule(rule, value);
                if (!status) {
                    this.messages.push(Validator.getMessage(rule));
                }
            }
        }
    }

    /**
     * Perform rule. Check data that value is goal
     *
     * @param {{}} params
     * @param {string|number} value
     * @returns {*}
     * @private
     */
    _performRule(params, value) {
        let rule = params['rule'];
        let mark = params['mark'];
        let field = params['field'];

        switch (rule) {
            case Validator.RULE_IS_EMAIL:
                return isEmail(value);
                break;
            case Validator.RULE_MAX_LENGTH:
                return isByteLength(value, {min: undefined, max: mark});
                break;
            case Validator.RULE_MIN_LENGTH:
                return isByteLength(value, {min: mark, max: undefined});
                break;
            case Validator.RULE_EQUAL_VALUE:
                return equals(value, mark);
                break;
            case Validator.RULE_EQUAL_BY_FIELD_NAME:
                let el = this._aria.findOne('[name="' + mark + '"]');
                return equals(value, el.value);
                break;
        }
    }

    /**
     * Get message
     *
     * @param {Object} params
     * @returns {string}
     */
    static getMessage(params) {
        let rule = params['rule'];
        let mark = params['mark'];
        let field = params['field'];
        let message = params['message'];

        switch (rule) {
            case Validator.RULE_IS_EMAIL:
                return message ? message : Validator.LBL(field) + ': Email address is invalid';
                break;
            case Validator.RULE_MAX_LENGTH:
                return message ? message : Validator.LBL(field) + ': The value should be less or equal ' + mark + ' character';
                break;
            case Validator.RULE_MIN_LENGTH:
                return message ? message : Validator.LBL(field) + ': The value should be more or equal ' + mark + ' character';
                break;
            case Validator.RULE_EQUAL_VALUE:
                return message ? message : Validator.LBL(field) + ': The value should be equals "' + mark + '"';
                break;
            case Validator.RULE_EQUAL_BY_FIELD_NAME:
                return message ? message : Validator.LBL(field) + ': The value should be equals with value of field "' + Validator.LBL(mark)  + '"';
        }
    }

    /**
     * Returns translated label or name of field
     *
     * @param {string} field - Field name
     * @returns {string}
     * @constructor
     */
    static LBL(field) {
        return field;
    }
}

export default Validator;