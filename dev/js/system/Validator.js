
import isEmpty from 'validator/lib/isEmpty';
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
         *          (string)fieldName: [
         *              {
         *                  status: (boolean)true,
         *                  element: (UIElement)
         *              }
         *              {
         *                  status: (boolean)false,
         *                  element: (UIElement)
         *              }
         *          ]
         *      }
         *
         * @type {Object.<Array.<{element: UIElement, status: boolean}>>}
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
     * Marker must be Array
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_LENGTH_BETWEEN_VALUES() {
        return 'RULE_LENGTH_BETWEEN_VALUES';
    }

    /**
     * Rule to check range between values of fields
     * Marker must be Array
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_LENGTH_BETWEEN_FIELDS() {
        return 'RULE_LENGTH_BETWEEN_FIELDS';
    }

    /**
     * Rule to check if value is not empty
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_REQUIRE() {
        return 'RULE_REQUIRE';
    }

    /**
     * Rule to check if value is not empty. Ignore space letters
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_REQUIRE_TRIM() {
        return 'RULE_REQUIRE_TRIM';
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
     * Rule to check if value is equal value of field
     * The value of field must be equal the third of parameters
     *
     * @returns {string}
     * @constructor
     */
    static get RULE_EQUAL_FIELD() {
        return 'RULE_EQUAL_FIELD';
    }

    /**
     *
     * @param {string} fieldName - name of filed
     * @param {string} rule - It is constants of current class
     * @param {?string|number|Array} [mark] - It is value to need check. e.g RULE_MAX_LENGTH need set mark to 20 or some another value
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
                    Validator._findFields(this._schema[field], this._listenerCheckedField.status, this._listenerCheckedField.listener);
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
        for (let rule of this._rules) {
            let field = rule['field'];
            if (!this._schema.hasOwnProperty(field)) {
                this._schema[field] = [];
                let elements = this._aria.findAll('[name^="' + field + '"]');
                for (let element of elements) {
                    this._schema[field].push({
                        status: true,
                        element: element
                    });
                }
            }
        }
        return this._schema;
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
     * @param {Object.<Array.<{element: UIElement, status: boolean}>>} data
     * @returns {void}
     * @private
     */
    _validate(data) {
        for (let rule of this._rules) {
            let field = rule['field'];
            if (!data.hasOwnProperty(field)) {
                this._messages.push('Can not find field "' + field + '"');
            }

            for (let row of data[field]) {
                let status = this._performRule(rule, row.element.value);
                if (!status) {
                    row.status = status;
                    this._messages.push(Validator.getMessage(rule));
                }
            }
        }
    }

    /**
     *
     * @param {Array.<{element: UIElement, status: boolean}>} fields
     * @param {?boolean} status
     * @param {listenerCheckedField} listener
     * @returns {void}
     * @private
     */
    static _findFields(fields, status, listener) {
        for (let field of fields) {
            if (status === null || field.status === status) {
                listener(field.element, field.status);
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
            case Validator.RULE_REQUIRE:
                return !isEmpty(value);
                break;
            case Validator.RULE_REQUIRE_TRIM:
                return !isEmpty(value.trim());
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
            case Validator.RULE_EQUAL_FIELD:
                let el = this._aria.findOne('[name="' + mark + '"]');
                return equals(value, el.value);
                break;
            case Validator.RULE_LENGTH_BETWEEN_VALUES:
                return isByteLength(value, {min: mark[0], max: mark[1]});
                break;
            case Validator.RULE_LENGTH_BETWEEN_FIELDS:
                let elMin = this._aria.findOne('[name="' + mark[0] + '"]');
                let elMax = this._aria.findOne('[name="' + mark[1] + '"]');
                return isByteLength(value, {min: elMin, max: elMax});
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
            case Validator.RULE_REQUIRE:
                return message ? message : Validator.LBL(field) + ': It is required fields';
                break;
            case Validator.RULE_REQUIRE_TRIM:
                return message ? message : Validator.LBL(field) + ': It is required fields';
                break;
            case Validator.RULE_MAX_LENGTH:
                return message ? message : Validator.LBL(field) + ': The length value should be less or equal ' + mark + ' character';
                break;
            case Validator.RULE_MIN_LENGTH:
                return message ? message : Validator.LBL(field) + ': The length should be more or equal ' + mark + ' character';
                break;
            case Validator.RULE_EQUAL_VALUE:
                return message ? message : Validator.LBL(field) + ': The value should be equal ' + mark + '';
                break;
            case Validator.RULE_EQUAL_FIELD:
                return message ? message : Validator.LBL(field) + ': The value should be equal with value of field "' + Validator.LBL(mark)  + '"';
                break;
            case Validator.RULE_LENGTH_BETWEEN_VALUES:
                return message ? message : Validator.LBL(field) + ': The length should be more or equal ' + mark[0] + ' and less or equal ' + mark[1] + ' character';
                break;
            case Validator.RULE_LENGTH_BETWEEN_FIELDS:
                return message ? message : Validator.LBL(field) + ': The length should be more or equal of field value ' + mark[0] + ' and less or equal of field value ' + mark[1] + ' character';
                break;
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
        return new Str(field)
            .uppercaseFirstLetter()
            .replaceSymbol('_', ' ')
            .uppercaseEachLetter()
            .toString();
    }
}

export default Validator;