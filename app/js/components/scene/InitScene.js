'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InitScene = function () {
  /**
   *
   * @param {string} id - Id is id of canvas element
   */
  function InitScene(id) {
    _classCallCheck(this, InitScene);

    /**
     *
     * @type {Element}
     */
    this.container = document.getElementById(id);

    /**
     *
     * @type {Clock}
     */
    this.clock = new THREE.Clock();

    /**
     *
     * @type {Scene}
     */
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 250, 3500);

    /**
     *
     * @type {PerspectiveCamera}
     */
    this.camera = new THREE.PerspectiveCamera(30, InitScene.aspect, 0.1, 20000);
    this.camera.position.set(0, 0, 700);
    this.camera.lookAt(this.scene.position);

    /**
     *
     * @type {WebGLRenderer|THREE.WebGLRenderer}
     */
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    /**
     *
     * @type {HemisphereLight|THREE.HemisphereLight}
     */
    this.hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.3);
    this.hemisphereLight.position.set(0, 1000, 1000);
    this.scene.add(this.hemisphereLight);

    /**
     *
     * @type {DirectionalLight|THREE.DirectionalLight}
     */
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.125);
    this.directionalLight.position.set(0, 0, 1).normalize();
    this.scene.add(this.directionalLight);

    /**
     *
     * @type {PointLight|THREE.PointLight}
     */
    this.pointLight = new THREE.PointLight(0xffffff, 0.5);
    this.pointLight.position.set(0, 100, 90);
    this.scene.add(this.pointLight);

    // Add two lights in the scene
    // An hemisphere light, to add different light from sky and ground
    // var light = new THREE.HemisphereLight(0xffffbb, 0x887979, 0.9);
    // this.scene.add(light);

    /**
     *
     * @type {Array}
     * @private
     */
    this._renderEvents = [];
  }

  /**
   *
   * @returns {number}
   */


  _createClass(InitScene, [{
    key: 'add',


    /**
     * Add element to scene
     *
     * @param {Mesh|Group} element
     * @returns {InitScene}
     */
    value: function add(element) {
      this.scene.add(element);
      return this;
    }

    /**
     * Render scene
     *
     * @returns {InitScene}
     */

  }, {
    key: 'render',
    value: function render() {
      this.renderer.setSize(InitScene.width, InitScene.height);
      this.container.appendChild(this.renderer.domElement);
      this._renderControls();
      this._resizeControls();
      return this;
    }

    /**
     * Add helper to scene
     *
     * @returns {InitScene}
     */

  }, {
    key: 'helper',
    value: function helper() {
      var axisHelper = new THREE.AxisHelper(50);
      this.scene.add(axisHelper);
      return this;
    }

    /**
     *
     * @param {number} delta
     * @callback renderEvent
     */

    /**
     *
     * @param event
     * @returns {InitScene}
     */

  }, {
    key: 'addRenderEvent',
    value: function addRenderEvent(event) {
      this._renderEvents.push(event);
      return this;
    }

    /**
     * Add event "resize" and rebuild scene when it was happened
     *
     * @returns {InitScene}
     * @private
     */

  }, {
    key: '_resizeControls',
    value: function _resizeControls() {
      var _this = this;

      window.addEventListener('resize', function () {
        _this.camera.aspect = InitScene.aspect;
        _this.camera.updateProjectionMatrix();
        _this.renderer.setSize(InitScene.width, InitScene.height);
      });
      return this;
    }

    /**
     * Render scene
     *
     * @private
     */

  }, {
    key: '_renderControls',
    value: function _renderControls() {
      var _this2 = this;

      var delta = this.clock.getDelta();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(function () {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this2._renderEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var event = _step.value;

            event(delta);
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

        _this2._renderControls();
      });
    }
  }], [{
    key: 'width',
    get: function get() {
      return window.innerWidth;
    }

    /**
     *
     * @returns {number}
     */

  }, {
    key: 'height',
    get: function get() {
      return window.innerHeight;
    }
  }, {
    key: 'aspect',


    /**
     *
     * @returns {number}
     */
    get: function get() {
      return InitScene.width / InitScene.height;
    }
  }]);

  return InitScene;
}();

exports.default = InitScene;