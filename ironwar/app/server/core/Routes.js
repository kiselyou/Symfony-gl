'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @type {string}
 */
var DIR_ROUTES = './../routing';

var Routes = function () {

    /**
     *
     */
    function Routes() {
        _classCallCheck(this, Routes);

        /**
         *
         * @type {Array}
         * @private
         */
        this._routes = [];
    }

    /**
     * @param {Array.<Routes.routes>} routes
     * @callback loadComplete
     */

    /**
     * This method are uploading file of routes configuration and put them to property "<Routes.routes>"
     *
     * @param {loadComplete} callback
     * @returns {Routes}
     */


    _createClass(Routes, [{
        key: 'load',
        value: function load(callback) {
            var _this = this;

            var dir = _path2.default.join(__dirname, DIR_ROUTES);

            _fs2.default.readdir(dir, function (err, files) {
                if (err) {
                    console.log('Cannot upload file of routes', 'Routes', 'load');
                    return;
                }

                var i = 0;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var fileName = _step.value;

                        var filePath = _path2.default.join(dir, fileName);
                        _fs2.default.readFile(filePath, 'utf8', function (err, data) {

                            if (err) {
                                console.log('Cannot read file of route', 'Routes', 'load');
                                return;
                            }

                            try {
                                var obj = JSON.parse(data);

                                for (var key in obj) {
                                    if (obj.hasOwnProperty(key)) {
                                        obj[key]['name'] = key;
                                        _this._routes.push(obj[key]);
                                    }
                                }

                                i++;

                                if (i === files.length) {
                                    callback(_this._routes);
                                }
                            } catch (e) {
                                console.log('Cannot read file of route', 'Routes', 'load', e);
                            }
                        });
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });
            return this;
        }
    }, {
        key: 'responseView',


        /**
         *
         * Send response to client
         *
         * @param {string} str
         * @returns {Server}
         */
        value: function responseView(str) {
            this.res.writeHead(200, this.conf.contentType());
            this.res.end(str, this.conf.encoding, true);
            return this;
        }
    }, {
        key: 'getAll',


        /**
         * Get all routes
         *
         * @returns {Array}
         */
        value: function getAll() {
            return this._routes;
        }
    }, {
        key: 'get',


        /**
         *
         * @param {string} name
         * @returns {*}
         */
        value: function get(name) {
            return this._routes.find(function (route) {
                return name === route['name'];
            });
        }
    }]);

    return Routes;
}();

/**
 *
 * @module Routes
 */


exports.default = Routes;