'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fonts = {};

var PATH_FONT_AUDIO_WIDE = './src/fonts/Audiowide/Audiowide_Regular.json';

var Font3D = function () {
    function Font3D() {
        _classCallCheck(this, Font3D);

        this._loader = new THREE.FontLoader();
    }

    /**
     * It is type of default font
     *
     * @returns {string}
     * @constructor
     */


    _createClass(Font3D, [{
        key: 'load',


        /**
         * Call this method when font was uploaded
         *
         * @param {Font}
         * @callback eventLoad
         */

        /**
         * Loading font
         *
         * @param {eventLoad} event
         * @param {string} type
         * @returns {void}
         */
        value: function load(event) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Font3D.FONT_DEFAULT;

            if (fonts.hasOwnProperty(type)) {
                event(fonts[type]);
            } else {
                this._loader.load(PATH_FONT_AUDIO_WIDE, function (font) {
                    fonts[type] = font;
                    event(font);
                });
            }
        }
    }], [{
        key: 'FONT_DEFAULT',
        get: function get() {
            return 'AUDIO_WIDE';
        }
    }]);

    return Font3D;
}();

exports.default = Font3D;