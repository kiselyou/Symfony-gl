import * as THREE from 'three';

class Tunnel {

    constructor() {

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
        this.speed = 0.01;

        this._loaded = false;

        /**
         *
         * @type {?Group|THREE.Group}
         * @private
         */
        this._mesh = new THREE.Group();
    }

    /**
     *
     * @returns {CatmullRomCurve3}
     * @private
     */
    static _getCurve() {
        // Create an empty array to stores the points
        let points = [];

        // Define points along Z axis
        for (let i = -25; i < 10; i++) {
            points.push(new THREE.Vector3(0, 0, 600 * (i / 4)));
        }

        // Set custom Y position for the last point
        // points[4].y = -0.06;

        // Create a curve based on the points
        return new THREE.CatmullRomCurve3(points);
    }

    /**
     *
     * @param {?Group|THREE.Group} element
     * @callback completeRender
     */

    /**
     *
     * @param {completeRender} [completeRender]
     * @returns {Tunnel}
     */
    render(completeRender) {
        this._loader.load('./src/img/test/555.jpg', (rockPattern) => {

            // Empty geometry
            let geometry = new THREE.Geometry();
            // Create vertices based on the curve
            geometry.vertices = this._curve.getPoints(70);
            // Create a line from the points with a basic line material
            this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

            // Create a material for the tunnel with a custom texture
            // Set side to BackSide since the camera is inside the tunnel
            this.tubeMaterial = new THREE.MeshStandardMaterial({
                side: THREE.BackSide,
                map: rockPattern,
                // transparent: true,
                // opacity: 0.5
            });

            // Repeat the pattern
            this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
            this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
            this.tubeMaterial.map.repeat.set(15, 15);

            // Create a tube geometry based on the curve
            this.tubeGeometry = new THREE.TubeGeometry(this._curve, 70, 350, 40, false);
            // Create a mesh based on the tube geometry and its material
            this._mesh.add(new THREE.Mesh(this.tubeGeometry, this.tubeMaterial));
            if (completeRender) {
                completeRender(this._mesh);
            }

            // Clone the original tube geometry
            // Because we will modify the visible one but we need to keep track of the original position of the vertices
            this.tubeGeometry_o = this.tubeGeometry.clone();

            this._loaded = true;
        });

        return this;
    }

    /**
     * Get object Tunnel
     *
     * @returns {?Group|THREE.Group}
     */
    get() {
        return this._mesh;
    }

    _updateMaterialOffset() {
        this.tubeMaterial.map.offset.x -= this.speed;
    }

    update() {
        if(this._loaded) {
            this._updateMaterialOffset();
        }
    }
}

export default Tunnel;
