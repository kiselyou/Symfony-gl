var IW = IW || {};
(function(IW) {
    'use strict';

    /**
     * @param {string} [inspectElement]
     * @param {string} [locale] - possible values IW.Validation.LOCALE_RU | IW.Validation.LOCALE_EN
     * @memberOf IW
     * @namespace IW.Validation
     * @constructor
     */
    IW.Validation = function( inspectElement, locale ) {

        /**
         *
         * @type {Element}
         * @private
         */
        var _inspectElement = inspectElement != undefined ? document.body.querySelector(inspectElement) : document.body;

        /**
         *
         * @type {Array}
         * @private
         */
        var _rules = [];

        /**
         *
         * @type {IW.Validation}
         */
        var scope = this;

        /**
         * type - type value
         * isNotSame - name field
         * label - label of field
         *
         * @param {string} name
         * @param {{ required: ?[boolean], max: ?[number], min: ?[number], type: ?[string], isNotSame: ?[string], isSame: ?[string], label: ?[string] }} rule
         */
        this.addRule = function (name, rule) {
            _rules.push({
                name: name,
                rule: rule
            });
        };

        var _itemsFragment = [];
        var fragment = document.createDocumentFragment();

        function clearMessages() {
            for (var a = 0; a < _itemsFragment.length; a++) {
                _itemsFragment[a].remove()
            }
        }

        /**
         *
         */
        function showMessages() {

            clearMessages();

            if (!scope.enableMessage) {
                return;
            }

            for (var i = 0; i < _errors.length; i++) {

                var msg = _errors[i]['msg'];

                if (msg == undefined) {
                    continue;
                }

                if (_messageTemplate) {
                    _messageTemplate.innerHTML = msg;
                    _itemsFragment.push(_messageTemplate);
                    fragment.appendChild(_messageTemplate);
                    continue;
                }

                var li = document.createElement('li');
                var gl = document.createElement('i');
                var span = document.createElement('span');
                span.innerHTML = ' ' + msg;
                gl.classList.add('glyphicon');
                gl.classList.add('glyphicon-exclamation-sign');
                li.appendChild(gl);
                li.appendChild(span);
                fragment.appendChild(li);
                _itemsFragment.push(li);
            }

            if (_messageElement) {
                _messageElement.innerHTML = '';
                _messageElement.appendChild(fragment);
            } else {
                _inspectElement.appendChild(fragment);
            }
        }

        /**
         *
         * @type {boolean}
         */
        this.enableMessage = true;

        /**
         *
         * @returns {IW.Validation}
         */
        this.disableMessages = function () {
            this.enableMessage = false;
            return this;
        };

        /**
         *
         * @type {?Element}
         * @private
         */
        var _messageTemplate = null;

        /**
         *
         * @type {?Element}
         * @private
         */
        var _messageElement = null;

        /**
         *
         * @param {Element|string} element
         * @param {?Element} [template]
         * @returns {IW.Validation}
         */
        this.messagesAppendTo = function (element, template) {
            if (element instanceof Element) {
                _messageElement = element;
            } else {
                _messageElement = _inspectElement.querySelector(element);
            }

            if (template) {
                _messageTemplate = template;
            }

            return this;
        };

        /**
         *
         * @type {Array}
         */
        var _eventElements = [];

        /**
         * Callback for currant element
         *
         * @param {Element} element
         * @param {Array} cache
         * @callback callbackCurrentElement
         */


        /**
         *
         *
         * @param {string} event
         * @param {string|Element} element - possible value (selector or document.body)
         * @param {callbackCurrentElement} [callback]
         * @returns {IW.Validation}
         */
        this.addEventCheckAll = function ( event, element, callback ) {
            addEvent( event, element, callback, 0 );
            return this;
        };

        /**
         *
         *
         * @param {string} event
         * @param {string|Element} element - possible value (selector or document.body)
         * @param {callbackCurrentElement} [callback]
         * @returns {IW.Validation}
         */
        this.addEventCheckCurrent = function ( event, element, callback ) {
            addEvent( event, element, callback, 1 );
            return this;
        };

        /**
         *
         *
         * @param {string} event
         * @param {string|Element} element - possible value (selector or document.body)
         * @param {callbackCurrentElement} [callback]
         * @param {number} type - possible value 0 or 1
         * @returns {IW.Validation}
         */
        function addEvent( event, element, callback, type ) {
            _eventElements.push({
                type: type,
                event: event,
                element: element,
                callback: callback
            });
        }

        /**
         *
         * @type {?string}
         */
        this._closest = null;

        this.error = IW.Validation.GROUP_CLASS_ERROR;
        this.success = IW.Validation.GROUP_CLASS_SUCCESS;

        /**
         * Find parent element and add class style (error or success)
         *
         * @param {string} selector
         * @returns {IW.Validation}
         */
        this.findParent = function ( selector ) {
            this._closest = selector;
            return this;
        };

        /**
         * Callback function if Success
         *
         * @param {Element} element
         * @param {array} fieldsSuccess
         * @param {array} fieldsAll
         * @callback validationCallbackSuccess
         */

        /**
         *
         * @type {(validationCallbackSuccess|null)}
         * @private
         */
        var _callbackSuccess = null;

        /**
         * Set callback function
         *
         * @param {validationCallbackSuccess} callback
         * @returns {IW.Validation}
         */
        this.setCallbackSuccess = function ( callback ) {
            _callbackSuccess = callback;
            return this;
        };

        /**
         * Callback function if Error
         *
         * @param {Element} element
         * @param {array} fieldsErrors
         * @param {array} fieldsAll
         * @callback validationCallbackError
         */

        /**
         *
         * @type {(validationCallbackError|null)}
         * @private
         */
        var _callbackError = null;

        /**
         * Set callback function
         *
         * @param {validationCallbackError} callback
         * @returns {IW.Validation}
         */
        this.setCallbackError = function ( callback ) {
            _callbackError = callback;
            return this;
        };

        /**
         * Begin listen document.
         *
         * @returns {IW.Validation}
         */
        this.listen = function() {
            for ( var i = 0; i < _eventElements.length; i++ ) {
                var element = _eventElements[i].element;
                if ( element instanceof Element ) {
                    event(_eventElements[i], element);
                } else {
                    var selector = _eventElements[i].element;
                    var elements = _inspectElement.querySelectorAll( selector );
                    for (var a = 0; a < elements.length; a++) {
                        event(_eventElements[i], elements[a]);
                    }
                }
            }

            return this;
        };

        /**
         * Add event
         *
         * @param {{ event: string, type: number, callback: function }} param
         * @param {Element} element
         * @returns {void}
         */
        function event(param, element) {
            switch (param.type) {
                case 0:
                    element.addEventListener(param.event, function () {
                        clearValidate();
                        validateAll(this, param.callback);
                    });
                    break;

                case 1:
                    element.addEventListener(param.event, function () {
                        clearValidate();
                        validateCurrent(this, param.callback);
                    });
                    break;
            }
        }

        /**
         *
         * @param {Element} element - It is element with have event
         * @param {callbackCurrentElement} [callback]
         * @returns {void}
         */
        function validateCurrent(element, callback) {

            if (element.value === '') {
                resetBlockError(element);
                clearMessages();
                return;
            }

            var name = element.getAttribute('name');
            var rule = findRule(name);

            var listFields = findField(name);
            checkNodeList(listFields, rule);

            setErrorToElement(_errors, true);
            setErrorToElement(_success, false);
            showMessages();

            if (callback) {
                callback.call(this, element, _cache.field);
            }
        }

        /**
         *
         * @param {Element} element - It is element with have event
         * @param {callbackCurrentElement} [callback]
         * @returns {void}
         */
        function validateAll(element, callback) {

            for (var i = 0; i < _rules.length; i++) {
                var listFields = findField( _rules[i]['name'] );
                checkNodeList(listFields, _rules[i]['rule']);
            }

            setErrorToElement(_errors, true);
            setErrorToElement(_success, false);
            showMessages();

            if (callback) {
                callback.call(this, element, _cache.field);
            }

            setCallback(element);
        }

        /**
         * Find rule
         *
         * @param {string} name
         * @returns {*}
         */
        function findRule(name) {

            var rule = _rules.find(function(a) {
                return name.indexOf(a.name) == 0;
            });

            return rule ? rule.rule : null;
        }

        /**
         *
         * @param {Element} element - It is element with have event
         * @returns {void}
         */
        function setCallback(element) {
            if (_errors.length == 0 && _callbackSuccess) {
                _callbackSuccess.call(this, element, _success, _cache.field);
            }

            if (_errors.length > 0 && _callbackError) {
                _callbackError.call(this, element, _errors, _cache.field);
            }
        }

        /**
         *
         * @returns {void}
         */
        function clearValidate() {
            _errors = [];
            _success = [];
        }

        /**
         * Clear marker from element
         *
         * @param {Element} element
         */
        function resetBlockError(element) {
            element.classList.remove(scope.success);
            element.classList.remove(scope.error);
            resetParentBlockError(element);
        }

        /**
         * Clear marker from grouped element
         *
         * @param {Element} element
         */
        function resetParentBlockError(element) {
            if (scope._closest) {
                var group = element.closest(scope._closest);
                for (var i = 0; i < group.length; i++) {
                    group[i].classList.remove(scope.success);
                    group[i].classList.remove(scope.error);
                }
            }
        }

        /**
         *
         * @param {Array} fields
         * @param {boolean} isError
         * @returns {void}
         */
        function setErrorToElement(fields, isError) {
            for (var i = 0; i < fields.length; i++) {
                if (scope._closest) {
                    parentBlockError(fields[i].field, isError);
                } else {
                    blockError(fields[i], isError);
                }
            }
        }

        /**
         *
         * @param {Element} field
         * @param {boolean} isError
         * @returns {void}
         */
        function parentBlockError(field, isError) {
            var groupMarkers = field.closest(scope._closest);
            if (groupMarkers) {
                if (isError) {
                    groupMarkers.classList.remove(scope.success);
                    groupMarkers.classList.add(scope.error);
                } else {
                    groupMarkers.classList.remove(scope.error);
                    groupMarkers.classList.add(scope.success);
                }
            } else {
                blockError(field, isError);
            }
        }

        /**
         *
         * @param {Element} field
         * @param {boolean} isError
         * @returns {void}
         */
        function blockError(field, isError) {
            if (isError) {
                field.classList.remove(IW.Validation.INPUT_CLASS_SUCCESS);
                field.classList.add(IW.Validation.INPUT_CLASS_ERROR);
            } else {
                field.classList.remove(IW.Validation.INPUT_CLASS_ERROR);
                field.classList.add(IW.Validation.INPUT_CLASS_SUCCESS);
            }
        }

        /**
         *
         * @type {Array}
         * @private
         */
        var _errors = [];

        /**
         *
         * @type {Array}
         * @private
         */
        var _success = [];

        /**
         *
         * @param {Element} field
         * @param {string} type
         * @param {{label: ?[string]}} rule
         * @returns {void}
         */
        function addError( field, type, rule ) {
            _errors.push({
                field: field,
                type: type,
                msg: buildMessage(rule, type)
            });
        }

        /**
         *
         * @param {Element} field
         * @returns {void}
         */
        function addSuccess(field) {
            _success.push({
                field: field
            });
        }

        /**
         * If true all messages will be in uppercase
         *
         * @type {boolean}
         */
        this.msgUpperCase = false;

        /**
         *
         * @param rule
         * @param type
         * @returns {*}
         */
        function buildMessage(rule, type) {

            var label = rule.label ? rule.label : '';

            var findRelation = [
                IW.Validation.VALIDATE_TYPE_ISNOTSAME,
                IW.Validation.VALIDATE_TYPE_ISSAME,
                IW.Validation.VALIDATE_TYPE_ISMATCH
            ];

            if (findRelation.indexOf(type) >= 0) {
                var ruleParam = findRule(rule[type]);
                if (ruleParam.hasOwnProperty('label')) {
                    label += ', ' + ruleParam.label;
                }
            }

            var except = [
                IW.Validation.VALIDATE_TYPE_REQUIRED,
                IW.Validation.VALIDATE_TYPE_ISNOTSAME,
                IW.Validation.VALIDATE_TYPE_ISSAME,
                IW.Validation.VALIDATE_TYPE_ISMATCH
            ];

            var typeValue = '';
            if (except.indexOf(type) < 0) {
                typeValue = rule[type] ? ' ' + rule[type] : '';
            }

            var str = label + ' - ' + scope.getMessages(scope.locale, type) + typeValue;
            if (scope.msgUpperCase) {
                return str.toUpperCase();
            } else {
                return capitalizeFirstLetter(str);
            }
        }

        /**
         * First symbol to uppercase
         *
         * @param {string} str
         * @returns {*}
         */
        function capitalizeFirstLetter(str) {
            if (str !== '') {
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            }
            return '';
        }

        /**
         * This is current locale
         *
         * @type {string}
         */
        this.locale = locale != undefined ? locale : IW.Validation.LOCALE_EN;

        /**
         *
         * @param {string} locale possible values (IW.Validation.LOCALE_RU | IW.Validation.LOCALE_EN)
         * @param {string} type possible values (IW.Validation.VALIDATE_TYPE_...)
         * @returns {*}
         */
        this.getMessages = function (locale, type) {
            return IW.Validation.MESSAGE[locale][type];
        };

        /**
         *
         * @param {NodeList} list
         * @param {{}} rule
         * @returns {void}
         */
        function checkNodeList(list, rule) {
            for (var a = 0; a < list.length; a++) {
                checkField(list[a], rule);
            }
        }

        /**
         *
         * @param {Element} field
         * @param {{}} rule
         * @returns {void}
         */
        function checkField(field, rule) {
            var len = field.value.length;

            for(var key in rule) {
                if (rule.hasOwnProperty(key)) {

                    switch (key) {
                        case IW.Validation.VALIDATE_TYPE_REQUIRED:
                            if ( rule[key] && field.value == '') {
                                addError(field, key, rule);
                                return;
                            }
                            break;
                        case IW.Validation.VALIDATE_TYPE_MAX:
                            if (len > rule[key]) {
                                addError(field, key, rule);
                                return;
                            }
                            break;
                        case IW.Validation.VALIDATE_TYPE_MIN:
                            if (len < rule[key]) {
                                addError(field, key, rule);
                                return;
                            }
                            break;
                        case IW.Validation.VALIDATE_TYPE_ISNOTSAME:
                            var isNotSame = _inspectElement.querySelector( "[name^='" + rule[key] + "']" );
                            if (field.value !== isNotSame.value && isNotSame.value !== '') {
                                addError(field, key, rule);
                                return;
                            }
                            break;
                        case IW.Validation.VALIDATE_TYPE_ISSAME:
                            var isSame = _inspectElement.querySelector( "[name^='" + rule[key] + "']" );
                            if (field.value === isSame.value && isSame.value !== '') {
                                addError(field, key, rule);
                                return;
                            }
                            break;
                        case IW.Validation.VALIDATE_TYPE_ISMATCH:
                            var isMatch = _inspectElement.querySelector( "[name^='" + rule[key] + "']" );
                            if (field.value.indexOf(isMatch.value) >= 0 && isMatch.value !== '') {
                                addError(field, key, rule);
                                return;
                            }
                            break;
                    }
                }
            }

            addSuccess(field);
        }

        /**
         *
         * @type {{field: {}}}
         * @private
         */
        var _cache = { field: {} };

        /**
         * Finds field
         *
         * @param {string} name
         * @returns {NodeList}
         */
        function findField( name ) {
            if (!_cache.field.hasOwnProperty(name)) {
                _cache.field[name] = _inspectElement.querySelectorAll("[name^='" + name + "']");
            }
            return _cache.field[name];
        }

    };

} (window.IW || {}));

IW.Validation.VALIDATE_TYPE_REQUIRED = 'required';
IW.Validation.VALIDATE_TYPE_MAX = 'max';
IW.Validation.VALIDATE_TYPE_MIN = 'min';
IW.Validation.VALIDATE_TYPE_TYPE = 'type';
IW.Validation.VALIDATE_TYPE_ISNOTSAME = 'isNotSame';
IW.Validation.VALIDATE_TYPE_ISSAME = 'isSame';
IW.Validation.VALIDATE_TYPE_ISMATCH = 'isMatch';
IW.Validation.VALIDATE_TYPE_LABEL = 'label';

IW.Validation.LOCALE_RU = 'ru';
IW.Validation.LOCALE_EN = 'en';

IW.Validation.MESSAGE = {};
IW.Validation.MESSAGE[IW.Validation.LOCALE_RU] = {};
IW.Validation.MESSAGE[IW.Validation.LOCALE_EN] = {};

IW.Validation.MESSAGE[IW.Validation.LOCALE_RU][IW.Validation.VALIDATE_TYPE_REQUIRED] = 'обязательное поле';
IW.Validation.MESSAGE[IW.Validation.LOCALE_RU][IW.Validation.VALIDATE_TYPE_MAX] = 'максимальная длина';
IW.Validation.MESSAGE[IW.Validation.LOCALE_RU][IW.Validation.VALIDATE_TYPE_MIN] = 'минимальная длина';
IW.Validation.MESSAGE[IW.Validation.LOCALE_RU][IW.Validation.VALIDATE_TYPE_ISNOTSAME] = 'значения не совпадают';
IW.Validation.MESSAGE[IW.Validation.LOCALE_RU][IW.Validation.VALIDATE_TYPE_ISSAME] = 'значения не должны совпадать';
IW.Validation.MESSAGE[IW.Validation.LOCALE_RU][IW.Validation.VALIDATE_TYPE_ISMATCH] = 'значения не должны иметь последовательность одинаковых символов';

IW.Validation.MESSAGE[IW.Validation.LOCALE_EN][IW.Validation.VALIDATE_TYPE_REQUIRED] = 'required field';
IW.Validation.MESSAGE[IW.Validation.LOCALE_EN][IW.Validation.VALIDATE_TYPE_MAX] = 'maximum length';
IW.Validation.MESSAGE[IW.Validation.LOCALE_EN][IW.Validation.VALIDATE_TYPE_MIN] = 'minimum length';
IW.Validation.MESSAGE[IW.Validation.LOCALE_EN][IW.Validation.VALIDATE_TYPE_ISNOTSAME] = 'values do not match';
IW.Validation.MESSAGE[IW.Validation.LOCALE_EN][IW.Validation.VALIDATE_TYPE_ISSAME] = 'values must not match';
IW.Validation.MESSAGE[IW.Validation.LOCALE_EN][IW.Validation.VALIDATE_TYPE_ISMATCH] = 'values must not have a sequence of identical characters';

IW.Validation.GROUP_CLASS_ERROR = 'iw_group_error';
IW.Validation.GROUP_CLASS_SUCCESS = 'iw_group_success';

IW.Validation.INPUT_CLASS_ERROR = 'iw_input_error';
IW.Validation.INPUT_CLASS_SUCCESS = 'iw_input_success';