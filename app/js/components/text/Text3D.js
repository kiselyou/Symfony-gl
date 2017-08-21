'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _Font3D2 = require('./Font3D');

var _Font3D3 = _interopRequireDefault(_Font3D2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Text3D = function (_Font3D) {
  _inherits(Text3D, _Font3D);

  function Text3D() {
    _classCallCheck(this, Text3D);

    var _this = _possibleConstructorReturn(this, (Text3D.__proto__ || Object.getPrototypeOf(Text3D)).call(this));

    _this._elements = [];

    /**
     * Count segments
     *
     * @type {number}
     */
    _this.curveSegments = 8;

    /**
     * Color front
     *
     * @type {number}
     */
    _this.colorFront = 0xffffff;

    /**
     * Color side
     *
     * @type {number}
     */
    _this.colorSide = 0xffffff;

    /**
     * Mirror text
     *
     * @type {boolean}
     */
    _this._mirror = false;

    /**
     *
     * @type {number}
     * @private
     */
    _this._size = 80;

    /**
     *
     * @type {number}
     * @private
     */
    _this._depth = 20;

    /**
     * Height of hover
     *
     * @type {number}
     * @private
     */
    _this._hover = 30;

    /**
     *
     * @type {number}
     * @private
     */
    _this._far = 0;

    /**
     *
     * @type {number}
     * @private
     */
    _this._targetTextRotation = Math.PI * 2;
    return _this;
  }

  /**
   * It is type of animation
   *
   * @returns {string}
   * @constructor
   */


  _createClass(Text3D, [{
    key: 'showMirror',


    /**
     * Set mirror
     *
     * @returns {Text3D}
     */
    value: function showMirror() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this._mirror = status;
      return this;
    }

    /**
     *
     * @param {number} far
     * @returns {Text3D}
     */

  }, {
    key: 'setFar',
    value: function setFar(far) {
      this._far = far;
      return this;
    }

    /**
     * Set height of hover
     *
     * @returns {Text3D}
     */

  }, {
    key: 'setHover',
    value: function setHover(hover) {
      this._hover = hover;
      return this;
    }

    /**
     * Set size of font
     *
     * @param {number} size
     * @returns {Text3D}
     */

  }, {
    key: 'setSize',
    value: function setSize(size) {
      this._size = size;
      return this;
    }

    /**
     * Set depth of font
     *
     * @param {number} depth
     * @returns {Text3D}
     */

  }, {
    key: 'setDepth',
    value: function setDepth(depth) {
      this._depth = depth;
      return this;
    }

    /**
     * Event when text create
     *
     * @param {Mesh|Group} text
     * @callback eventDone
     */

    /**
     *
     * @param {string} text
     * @param {eventDone} done
     */

  }, {
    key: 'write',
    value: function write(text, done) {
      var _this2 = this;

      this.load(function (font) {
        var textGeo = new THREE.TextGeometry(text, {
          font: font,
          size: _this2._size,
          height: _this2._depth,
          curveSegments: _this2.curveSegments,
          bevelThickness: 2,
          bevelSize: 1.5,
          bevelEnabled: true,
          material: 0,
          extrudeMaterial: 1
        });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        var material = [new THREE.MeshPhongMaterial({ color: _this2.colorFront, shading: THREE.FlatShading }), new THREE.MeshPhongMaterial({ color: _this2.colorSide, shading: THREE.SmoothShading })];

        var textMesh = new THREE.Mesh(textGeo, material);
        var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        textMesh.position.x = centerOffset;
        textMesh.position.y = _this2._hover;
        textMesh.rotation.y = Math.PI * 2;

        if (_this2._mirror) {
          var group = new THREE.Group();
          group.add(textMesh);

          var mirrorMesh = new THREE.Mesh(textGeo, material);
          mirrorMesh.position.x = centerOffset;
          mirrorMesh.position.y = -_this2._hover;
          mirrorMesh.position.z = _this2._depth;
          mirrorMesh.rotation.x = Math.PI;
          mirrorMesh.rotation.y = Math.PI * 2;
          group.position.z = _this2._far;
          group.add(mirrorMesh);
          _this2._elements.push(group);
          done(group);
        } else {
          textMesh.position.z = _this2._far;
          _this2._elements.push(textMesh);
          done(textMesh);
        }
      });
    }

    /**
     * Call this method inside function render
     *
     * @param {?string} [type] - Type of animation. Possible values it is constants of current class
     * @param {number} [speed] - It is speed animation
     */

  }, {
    key: 'animation',
    value: function animation() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Text3D.ANIMATION_AXIS_Y;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.01;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var element = _step.value;

          switch (type) {
            case Text3D.ANIMATION_AXIS_Y_180:
              element.rotation.y += (this._targetTextRotation - element.rotation.y) * speed;
              break;
            case Text3D.ANIMATION_AXIS_Y:
            default:
              element.rotation.y += speed;
              break;
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
    }

    /**
     * Event when text created and rendering
     *
     * @param {Mesh|Group}
     * @callback eventRender
     */

    /**
     * Call this method inside function render
     *
     * @param {eventRender} eventRender
     * @returns {void}
     */

  }, {
    key: 'update',
    value: function update(eventRender) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this._elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var element = _step2.value;

          eventRender(element);
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
  }], [{
    key: 'ANIMATION_AXIS_Y_180',
    get: function get() {
      return 'ANIMATION_AXIS_Y_180';
    }

    /**
     * It is type of animation
     *
     * @returns {string}
     * @constructor
     */

  }, {
    key: 'ANIMATION_AXIS_Y',
    get: function get() {
      return 'ANIMATION_AXIS_Y';
    }
  }]);

  return Text3D;
}(_Font3D3.default);

exports.default = Text3D;