'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tunnel = function () {
    function Tunnel() {
        _classCallCheck(this, Tunnel);

        /**
         *
         * @type {TextureLoader}
         * @private
         */
        this._loader = new THREE.TextureLoader();

        /**
         *
         * @type {?Line}
         */
        this.splineMesh = null;

        /**
         *
         * @type {?TubeGeometry}
         */
        this.tubeGeometry = null;

        /**
         *
         * @type {?TubeGeometry}
         */
        this.tubeGeometry_o = null;

        /**
         *
         * @type {?MeshStandardMaterial}
         */
        this.tubeMaterial = null;

        /**
         *
         * @type {CatmullRomCurve3}
         * @private
         */
        this._curve = Tunnel._getCurve();

        /**
         *
         * @type {number}
         */
        this.speed = 0.02;

        this._loaded = false;
    }

    /**
     *
     * @returns {CatmullRomCurve3}
     * @private
     */


    _createClass(Tunnel, [{
        key: 'render',


        /**
         *
         * @param {Mesh} element
         * @callback completeRender
         */

        /**
         *
         * @param {completeRender} complete
         * @returns {Tunnel}
         */
        value: function render(complete) {
            var _this = this;

            this._loader.load('./src/img/test/0241-galvanised-steel-metal-facade-cladding-texture-seamless-hr.jpg', function (rockPattern) {

                // Empty geometry
                var geometry = new THREE.Geometry();
                // Create vertices based on the curve
                geometry.vertices = _this._curve.getPoints(70);
                // Create a line from the points with a basic line material
                _this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

                // Create a material for the tunnel with a custom texture
                // Set side to BackSide since the camera is inside the tunnel
                _this.tubeMaterial = new THREE.MeshStandardMaterial({
                    side: THREE.BackSide,
                    map: rockPattern
                    // transparent: true,
                    // opacity: 0.5
                });

                // Repeat the pattern
                _this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
                _this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
                _this.tubeMaterial.map.repeat.set(7, 7);

                // Create a tube geometry based on the curve
                _this.tubeGeometry = new THREE.TubeGeometry(_this._curve, 70, 400, 50, false);
                // Create a mesh based on the tube geometry and its material
                complete(new THREE.Mesh(_this.tubeGeometry, _this.tubeMaterial));

                // Clone the original tube geometry
                // Because we will modify the visible one but we need to keep track of the original position of the vertices
                _this.tubeGeometry_o = _this.tubeGeometry.clone();

                _this._loaded = true;
            });

            return this;
        }
    }, {
        key: '_updateMaterialOffset',
        value: function _updateMaterialOffset() {
            this.tubeMaterial.map.offset.x -= this.speed;
        }
    }, {
        key: '_updateCurve',
        value: function _updateCurve() {

            var index = 0,
                vertice_o = null,
                vertice = null;
            // For each vertex of the tube, move it a bit based on the spline
            for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
                // Get the original tube vertex
                vertice_o = this.tubeGeometry_o.vertices[i];
                // Get the visible tube vertex
                vertice = this.tubeGeometry.vertices[i];
                // Calculate index of the vertex based on the Z axis
                // The tube is made of 50 rings of vertices
                index = Math.floor(i / 50);
                // Update tube vertex
                vertice.x += (vertice_o.x + this.splineMesh.geometry.vertices[index].x - vertice.x) / 10;
                vertice.y += (vertice_o.y + this.splineMesh.geometry.vertices[index].y - vertice.y) / 5;
            }
            // Warn ThreeJs that the points have changed
            this.tubeGeometry.verticesNeedUpdate = true;

            // Update the points along the curve base on mouse position
            this._curve.points[2].x = 0.1; //-this.mouse.position.x * 0.1;
            this._curve.points[4].x = 0.1; //-this.mouse.position.x * 0.1;
            this._curve.points[2].y = 0.1; //this.mouse.position.y * 0.1;

            // Warn ThreeJs that the spline has changed
            this.splineMesh.geometry.verticesNeedUpdate = true;
            this.splineMesh.geometry.vertices = this._curve.getPoints(70);
        }
    }, {
        key: 'update',
        value: function update() {
            if (this._loaded) {
                this._updateMaterialOffset();
                // this._updateCurve();
            }
        }
    }], [{
        key: '_getCurve',
        value: function _getCurve() {
            // Create an empty array to stores the points
            var points = [];

            // Define points along Z axis
            for (var i = -15; i < 2; i++) {
                points.push(new THREE.Vector3(0, 0, 600 * (i / 4)));
            }

            // Set custom Y position for the last point
            // points[4].y = -0.06;

            // Create a curve based on the points
            return new THREE.CatmullRomCurve3(points);
        }
    }]);

    return Tunnel;
}();

exports.default = Tunnel;