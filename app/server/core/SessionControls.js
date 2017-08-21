'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SessionControls = function () {

    /**
     *
     * @param {Object} session
     */
    function SessionControls(session) {
        _classCallCheck(this, SessionControls);

        this._session = session;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */


    _createClass(SessionControls, [{
        key: 'addSession',


        /**
         *
         * @param {(string|number)} key
         * @param {*} [value]
         * @returns {SessionControls}
         */
        value: function addSession(key) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this._session[key] = value;
            return this;
        }

        /**
         * Get session of user
         *
         * @returns {?Object}
         */

    }, {
        key: 'getSessionUser',
        value: function getSessionUser() {
            if (this.isSessionUser()) {
                return this._session[this.KEY_USER_INFO];
            }
            return null;
        }

        /**
         * Set session
         *
         * @param {(string|number)} id
         * @param {Object} [data]
         * @returns {SessionControls}
         */

    }, {
        key: 'setSessionUser',
        value: function setSessionUser(id) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            data['id'] = id;
            this.addSession(this.KEY_USER_INFO, data);
            return this;
        }

        /**
         * Get ID of user
         *
         * @returns {?(string|number)}
         */

    }, {
        key: 'setSessionUserID',
        value: function setSessionUserID() {
            var user = this.getSessionUser();
            return user ? user['id'] : null;
        }

        /**
         *
         * @returns {boolean}
         */

    }, {
        key: 'isSessionUser',
        value: function isSessionUser() {
            return this._session && this._session[this.KEY_USER_INFO] ? true : false;
        }

        /**
         * Remove session of user
         *
         * @returns {SessionControls}
         */

    }, {
        key: 'destroySession',
        value: function destroySession() {
            if (this._session) {
                this._session.destroy();
            }
            return this;
        }
    }], [{
        key: 'KEY_USER_INFO',
        get: function get() {
            return 'session_user_info';
        }
    }]);

    return SessionControls;
}();

exports.default = SessionControls;