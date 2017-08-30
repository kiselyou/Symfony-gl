
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import equals from 'validator/lib/equals';

import UIElement from './ui/UIElement';

class Validator {
    /**
     *
     * @param {?string} [controlsAria] - It is element to controls validation e.g. Check if field has the same value as field by name
     * @param {UIElement} [blockWarning] - The block where will show messages of errors or method "blockWarning"
     */
    constructor(controlsAria, blockWarning) {

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

        /**
         * @type {UIElement}
         * @private
         */
        this._aria = new UIElement(controlsAria ? controlsAria : document.body);
    }

    /**
     * The block where will show messages of errors
     *
     * @param {UIElement} blockWarning
     */
    blockWarning(blockWarning) {
        this._blockWarning = blockWarning;
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
        let result = {};
        if (data instanceof FormData) {
            for (let stack of this._rules) {
                let field = stack['field'];
                if (!result.hasOwnProperty(field)) {
                    result[field] = data.getAll(field);
                }
            }
        } else {
            for (let field in data) {
                if (data.hasOwnProperty(field)) {
                    result[field] = [field];
                }
            }
        }
        return result;
    }

    /**
     *
     * @param {Object} data
     * @returns {Array}
     * @private
     */
    _validate(data) {
        let status = [];
        for (let rule of this._rules) {
            let field = rule['field'];
            if (!data.hasOwnProperty(field)) {
                status.push('Can not find field "' + field + '"');
            }

            for (let value of data[field]) {
                let perform = this._performRule(rule, value);
                if (!perform['status']) {
                    status.push(perform);
                }
            }
        }
        return status;
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

        let response = {
            msg: '',
            status: true,
            field: params['field']
        };


        switch (rule) {
            case Validator.RULE_IS_EMAIL:
                response['status'] = isEmail(value);
                response['msg'] = 'Your email address is invalid';
                break;
            case Validator.RULE_MAX_LENGTH:
                response['status'] = isByteLength(value, {min: undefined, max: mark});
                response['msg'] = field + ' should be maximum ' + mark + ' character';
                break;
            case Validator.RULE_MIN_LENGTH:
                response['status'] = isByteLength(value, {min: mark, max: undefined});
                response['msg'] = field + ' should be minimum ' + mark + ' character';
                break;
            case Validator.RULE_EQUAL_VALUE:
                response['status'] = equals(value, mark);
                response['msg'] = field + ' should be equals "' + mark + '"';
                break;
            case Validator.RULE_EQUAL_BY_FIELD_NAME:
                let element = this._aria.findOne('[name="' + mark + '"]');
                response['status'] = equals(value, element.value);
                response['msg'] = field + ' should be equals value of field "' + mark + '"';
                break;
        }
        return response;
    }
}

export default Validator;