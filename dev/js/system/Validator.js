
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import equals from 'validator/lib/equals';
import UIElement from './ui/UIElement';
import Str from './Str';

class Validator {
    /**
     *
     * @param {?(UIElement|Element|string)} [controlsAria] - It is element to controls validation e.g. Check if field has the same value as field by name
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
        this._aria = controlsAria instanceof UIElement ? controlsAria : new UIElement(document.body);

        /**
         *
         * @type {Array}
         */
        this._messages = [];

        /**
         * <input type="text" name="fieldName[0]"> the same <input type="text" name="fieldName">
         * <input type="text" name="fieldName[1]">
         * e.g
         *      {
         *          (string)fieldName: {
         *              (integer)0: (boolean)status
         *              (integer)1: (boolean)status
         *          }
         *      }
         *
         * @type {{}}
         * @private
         */
        this._schema = {};

        /**
         *
         * @type {{status: ?boolean, listener: ?listenerCheckedField}}
         * @private
         */
        this._listenerCheckedField = {status: null, listener: null};
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
     * @param {Object} [data]
     * @returns {boolean}
     */
    start(data) {
        this._clean();
        let params = {};
        if (data instanceof FormData) {
            params = this._prepareFormData();
        }
        this._validate(params);
        this._setListenerCheckedField();
        return this.isError();
    }

    /**
     * Check status of validation
     *
     * @returns {boolean}
     */
    isError() {
        return this._messages.length > 0;
    }

    /**
     * Get messages
     *
     * @returns {Array}
     */
    getMessages() {
        return this._messages;
    }

    /**
     * Get schema
     * The schema consist of fields that were checked
     *
     * @returns {Object}
     */
    getSchema() {
        return this._schema;
    }

    /**
     *
     * @param {UIElement}
     * @param {boolean} status
     * @callback listenerCheckedField
     */

    /**
     *
     * @param {?boolean} status - true (Fields only with status true)
     *                            false (Fields only with status false)
     *                            null (Fields with any status)
     * @param {listenerCheckedField} listener
     * @returns {Validator}
     */
    findCheckedFields(status, listener) {
        this._listenerCheckedField = {
            status: status,
            listener: listener
        };
        return this;
    }

    /**
     * Set listener to find fields after validation
     *
     * @returns {void}
     * @private
     */
    _setListenerCheckedField() {
        if (this._listenerCheckedField.listener) {
            for (let field in this._schema) {
                if (this._schema.hasOwnProperty(field)) {
                    this._findFields(field, this._listenerCheckedField.status, this._listenerCheckedField.listener);
                }
            }
        }
    }

    /**
     * Prepare Form Data to validate
     *
     * @returns {Object.<Array>}
     * @private
     */
    _prepareFormData() {
        let result = {};
        for (let rule of this._rules) {
            let field = rule['field'];
            if (!result.hasOwnProperty(field)) {
                result[field] = [];
                let elements = this._aria.findAll('[name^="' + field + '"]');
                for (let element of elements) {
                    result[field].push(element.value);
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
        this._messages = [];
        this._schema = {};
    }

    /**
     *
     * @param {Object.<Array>} data
     * @returns {void}
     * @private
     */
    _validate(data) {
        for (let rule of this._rules) {
            let field = rule['field'];
            if (!data.hasOwnProperty(field)) {
                this._messages.push('Can not find field "' + field + '"');
            }
            let key = 0;
            for (let value of data[field]) {
                let status = this._performRule(rule, value);
                this._schemaControls(field, key, status);
                if (!status) {
                    this._messages.push(Validator.getMessage(rule));
                }
                key++;
            }
        }
    }

    /**
     * Add information about validation to schema
     *
     * @param {string} field
     * @param {number} key
     * @param {boolean} status
     * @returns {void}
     * @private
     */
    _schemaControls(field, key, status) {
        if (!this._schema.hasOwnProperty(field)) {
            this._schema[field] = {};
        }

        this._schema[field][key] = status;
    }

    /**
     *
     * @param {string} field
     * @param {?boolean} status
     * @param {listenerCheckedField} listener
     * @returns {void}
     * @private
     */
    _findFields(field, status, listener) {
        let fields = this._schema[field];
        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                let checkResult = fields[key];
                if (status === null || checkResult == status) {
                    let el = this._aria.findOne('[name="' + field + '[' + key + ']"]') || this._aria.findOne('[name="' + field + '"]');
                    listener(el, checkResult);
                }
            }
        }
    }

    /**
     * Perform rule. Check data that value is goal
     *
     * @param {{rule: string, mark: *, field: string}} params
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
        return Str.uppercaseFirstLetter(field);
    }
}

export default Validator;