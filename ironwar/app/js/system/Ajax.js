'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @type {string}
 */
var AJAX_GET = 'GET';

/**
 *
 * @type {string}
 */
var AJAX_POST = 'POST';

var Ajax = function () {
    function Ajax() {
        _classCallCheck(this, Ajax);
    }

    _createClass(Ajax, [{
        key: 'post',


        /**
         * Send POST data
         *
         * @param {string} url
         * @param {FormData|{}|Array} param
         * @returns {Promise}
         */
        value: function post(url, param) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this._execute(function (xhr) {
                    xhr.open(AJAX_POST, Ajax._preparePostData(param));
                    xhr.send(data);
                }, resolve, reject);
            });
        }
    }, {
        key: 'get',


        /**
         * Send GET data
         *
         * @param {string} url
         * @param {{}|[]} [params]
         * @returns {Promise}
         */
        value: function get(url) {
            var _this2 = this;

            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return new Promise(function (resolve, reject) {
                _this2._execute(function (xhr) {
                    xhr.open(AJAX_GET, Ajax._prepareGetURL(url, params));
                    xhr.send();
                }, resolve, reject);
            });
        }
    }, {
        key: '_execute',


        /**
         * @param {XMLHttpRequest} xhr
         * @callback HttpRequestMethod
         */

        /**
         * @param {number} status
         * @param {string} statusText
         * @callback HttpResponseError
         */

        /**
         * @param {string} responseText
         * @callback HttpResponseSuccess
         */

        /**
         * Execute sending data to server
         *
         * @param {HttpRequestMethod} method
         * @param {HttpResponseSuccess} onSuccess
         * @param {HttpResponseError} [onError]
         * @returns {void}
         */
        value: function _execute(method, onSuccess) {
            var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var xhr = new XMLHttpRequest();
            method(xhr);
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }

                if (xhr.status != 200) {
                    if (onError) {
                        onError(xhr.status, xhr.statusText);
                    }
                } else {
                    onSuccess(xhr.responseText);
                }
            };
        }
    }], [{
        key: '_preparePostData',


        /**
         * Control params
         *
         * @param {FormData|{}|Array} param
         * @returns {FormData}
         * @private
         */
        value: function _preparePostData(param) {
            if (!(param instanceof FormData)) {
                var formData = new FormData();
                for (var key in param) {
                    if (param.hasOwnProperty(key)) {
                        if (_typeof(param[key]) === 'object') {
                            formData.append(key, _qs2.default.stringify(param[key], { encode: false }));
                        } else {
                            formData.append(key, param[key]);
                        }
                    }
                }
                return formData;
            }
            return param;
        }

        /**
         * Prepare url to send on server
         *
         * @param {string} url
         * @param {{}|[]} [params]
         * @returns {string}
         * @private
         */

    }, {
        key: '_prepareGetURL',
        value: function _prepareGetURL(url) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return params ? _qs2.default.stringify(params, { addQueryPrefix: url.indexOf('?') === -1 }) : '';
        }
    }]);

    return Ajax;
}();

exports.default = Ajax;