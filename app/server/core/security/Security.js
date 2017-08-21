'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Authorization2 = require('./Authorization');

var _Authorization3 = _interopRequireDefault(_Authorization2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Security = function (_Authorization) {
    _inherits(Security, _Authorization);

    /**
     *
     * @type {Server}
     */
    function Security(server) {
        _classCallCheck(this, Security);

        /**
         *
         * @type {Conf}
         */
        var _this = _possibleConstructorReturn(this, (Security.__proto__ || Object.getPrototypeOf(Security)).call(this, server));

        _this._conf = server.config;
        return _this;
    }

    /**
     *
     * @param {string} route
     * @param {string} role - It is role of user
     * @returns {boolean}
     */


    _createClass(Security, [{
        key: 'isGranted',
        value: function isGranted(route, role) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._conf.accessControl[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    var grant = route.replace(/^\/|\/$/g, '').split('/', 1);
                    if (grant[0] === item['path'].replace(/^\/|\/$/g, '')) {
                        return !item.hasOwnProperty('role') || role === item['role'] || this.hasRole(role, item['role']);
                    }
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

            return true;
        }

        /**
         *
         * @param {string} roleParent - Parent role. Role where will find children role
         * @param {string} roleChildren - Children role
         * @returns {boolean}
         */

    }, {
        key: 'hasRole',
        value: function hasRole(roleParent, roleChildren) {
            var has = false;
            var hierarchy = this._conf.roleHierarchy;
            if (hierarchy.hasOwnProperty(roleParent)) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = hierarchy[roleParent][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var role = _step2.value;

                        has = roleChildren === role ? true : this.hasRole(role, roleChildren);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            return has;
        }
    }]);

    return Security;
}(_Authorization3.default);

/**
 *
 * @module Security
 */


exports.default = Security;