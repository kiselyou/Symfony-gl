var IW = IW || {};
(function(IW) {
    'use strict';

    /**
     * @param {string} [inspectElement]
     * @memberOf IW
     * @namespace IW.Validation
     * @constructor
     */
    IW.Validation = function( inspectElement ) {

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
         * msg - message if not valid
         *
         * @param {string} name
         * @param {{ required: ?[boolean], max: ?[number], min: ?[number], type: ?[string], isNotSame: ?[string], isSame: ?[string], msg: ?[string] }} rule
         */
        this.addRile = function (name, rule) {
            _rules.push({
                name: name,
                rule: rule
            });
        };

        var _itemsFragment = [];
        var fragment = document.createDocumentFragment();

        /**
         *
         */
        function showMessages() {

            for (var a = 0; a < _itemsFragment.length; a++) {
                _itemsFragment[a].remove()
            }

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
         *
         *
         * @param {string} event
         * @param {string|Element} element - possible value (selector or document.body)
         * @returns {IW.Validation}
         */
        this.addEventCheckAll = function ( event, element ) {
            addEvent( event, element, 0 );
            return this;
        };

        /**
         *
         *
         * @param {string} event
         * @param {string|Element} element - possible value (selector or document.body)
         * @returns {IW.Validation}
         */
        this.addEventCheckCurrent = function ( event, element ) {
            addEvent( event, element, 1 );
            return this;
        };

        /**
         *
         *
         * @param {string} event
         * @param {string|Element} element - possible value (selector or document.body)
         * @param {number} type - possible value 0 or 1
         * @returns {IW.Validation}
         */
        function addEvent( event, element, type ) {
            _eventElements.push({
                event: event,
                element: element,
                type: type
            });
        }

        /**
         *
         * @type {?string}
         */
        var _groupMarker = null;

        /**
         *
         * @type {boolean}
         */
        this.enableMarker = true;

        /**
         * Add element to group marker (Success or error). This element must be on same layer what is field
         *
         * @param {string} selector
         * @returns {IW.Validation}
         */
        this.addGroupMarker = function ( selector ) {
            _groupMarker = selector;
            return this;
        };

        /**
         * Callback function if Success
         *
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
         *  @param {array} fieldsErrors
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
         * @param {{event: string, type: number}} param
         * @param {Element} element
         * @returns {void}
         */
        function event(param, element) {
            switch (param.type) {
                case 0:
                    element.addEventListener(param.event, validateAll);
                    break;

                case 1:
                    element.addEventListener(param.event, validateCurrent);
                    break;
            }
        }

        /**
         *
         * @returns {void}
         */
        function validateCurrent() {
            clearValidate();

            var name = this.getAttribute('name');
            var rule = _rules.find(function(a) {
                return name.indexOf(a.name) == 0;
            });

            var listFields = findField(name);
            checkNodeList(listFields, rule.rule);

            setMarkers(_errors, true);
            setMarkers(_success, false);
            showMessages();
            setCallback();
        }

        /**
         *
         * @returns {void}
         */
        function validateAll() {
            clearValidate();

            for (var i = 0; i < _rules.length; i++) {
                var listFields = findField( _rules[i]['name'] );
                checkNodeList(listFields, _rules[i]['rule']);
            }

            setMarkers(_errors, true);
            setMarkers(_success, false);
            showMessages();
            setCallback();
        }

        /**
         *
         * @returns {void}
         */
        function setCallback() {
            if (_errors.length == 0 && _callbackSuccess) {
                _callbackSuccess.call(this, _success, _cache.field);
            }

            if (_errors.length > 0 && _callbackError) {
                _callbackError.call(this, _errors, _cache.field);

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
         *
         * @param {Array} fields
         * @param {boolean} isError
         * @returns {void}
         */
        function setMarkers(fields, isError) {
            if (scope.enableMarker) {

                for (var i = 0; i < fields.length; i++) {
                    if (isError) {
                        fields[i].field.classList.remove(IW.Validation.VALIDATE_SUCCESS);
                        fields[i].field.classList.add(IW.Validation.VALIDATE_ERROR);
                    } else {
                        fields[i].field.classList.remove(IW.Validation.VALIDATE_ERROR);
                        fields[i].field.classList.add(IW.Validation.VALIDATE_SUCCESS);
                    }
                    setGroupMarkers(fields[i].field, isError);
                }
            }
        }

        /**
         *
         * @param {Element} field
         * @param {boolean} isError
         * @returns {void}
         */
        function setGroupMarkers(field, isError) {
            if (_groupMarker) {

                var groupMarkers = field.parentElement.querySelectorAll(_groupMarker);
                for (var i = 0; i < groupMarkers.length; i++) {
                    if (isError) {
                        groupMarkers[i].classList.remove(IW.Validation.VALIDATE_SUCCESS);
                        groupMarkers[i].classList.add(IW.Validation.VALIDATE_ERROR);
                    } else {
                        groupMarkers[i].classList.remove(IW.Validation.VALIDATE_ERROR);
                        groupMarkers[i].classList.add(IW.Validation.VALIDATE_SUCCESS);
                    }
                }
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
         * @param {string} msg
         * @returns {void}
         */
        function addError( field, type, msg ) {
            _errors.push({
                field: field,
                type: type,
                msg: msg
            });
        }

        /**
         *
         * @returns {void}
         */
        function addSuccess( field ) {
            _success.push({
                field: field
            });
        }

        /**
         *
         * @param {Array} list
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
                        case 'required':
                            if ( rule[key] && field.value == '') {
                                addError( field, 'required', rule['msg'] );
                                return;
                            }
                            continue;
                        case 'max':
                            if (len > rule[key]) {
                                addError( field, 'max', rule['msg'] );
                                return;
                            }
                            continue;
                        case 'min':
                            if (len < rule[key]) {
                                addError( field, 'min', rule['msg'] );
                                return;
                            }
                            continue;
                        case 'isNotSame':
                            var isNotSame = _inspectElement.querySelector( "[name^='" + rule[key] + "']" );
                            if (field.value != isNotSame.value) {
                                addError( field, 'isNotSame', rule['msg'] );
                                return;
                            }
                            continue;
                        case 'isSame':
                            var isSame = _inspectElement.querySelector( "[name^='" + rule[key] + "']" );
                            if (field.value == isSame.value) {
                                addError( field, 'isSame', rule['msg'] );
                                return;
                            }
                            break;
                    }
                }
            }

            addSuccess( field );
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

IW.Validation.VALIDATE_ERROR = 'sw-status-error';
IW.Validation.VALIDATE_SUCCESS = 'sw-status-success';