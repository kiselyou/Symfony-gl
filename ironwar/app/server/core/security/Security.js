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
     * @type {Conf}
     */
    function Security(config) {
        _classCallCheck(this, Security);

        /**
         *
         * @type {Conf}
         */
        var _this = _possibleConstructorReturn(this, (Security.__proto__ || Object.getPrototypeOf(Security)).call(this, config));

        _this.conf = config;
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
            var pathControls = this.conf.accessControl;

            for (var i = 0; i < pathControls.length; i++) {
                var find = pathControls[i]['path'].replace(/^\/|\/$/g, '');
                var grant = route.replace(/^\/|\/$/g, '').split('/', 1);
                if (grant[0] == find) {
                    return !pathControls[i].hasOwnProperty('role') || role === pathControls[i]['role'] || this.hasRole(role, pathControls[i]['role']);
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
            var hierarchy = this.conf.roleHierarchy;
            if (hierarchy.hasOwnProperty(roleParent)) {
                for (var i = 0; i < hierarchy[roleParent].length; i++) {
                    has = roleChildren === hierarchy[roleParent][i] ? true : this.hasRole(hierarchy[roleParent][i], roleChildren);
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