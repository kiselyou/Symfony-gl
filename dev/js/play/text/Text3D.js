import * as THREE from 'three';
import Font3D from './Font3D';

class Text3D extends Font3D {

    constructor() {
        super();

        /**
         * Count segments
         *
         * @type {number}
         */
        this.curveSegments = 4;

        /**
         * Color front
         *
         * @type {number}
         */
        this.colorFront = 0x666666;

        /**
         * Color side
         *
         * @type {number}
         */
        this.colorSide = 0x666666;

        /**
         * Mirror text
         *
         * @type {boolean}
         */
        this._mirror = false;

        /**
         *
         * @type {number}
         * @private
         */
        this._size = 60;

        /**
         *
         * @type {number}
         * @private
         */
        this._depth = 20;

        /**
         * Height of hover
         *
         * @type {number}
         * @private
         */
        this._hover = 30;

        /**
         *
         * @type {number}
         * @private
         */
        this._far = 0;

        /**
         *
         * @type {number}
         * @private
         */
        this._targetTextRotation = Math.PI * 2;

        /**
         * Get object Text
         *
         * @type {?Group}
         * @private
         */
        this._mesh = new THREE.Group();
    }

    /**
     * It is type of animation
     *
     * @returns {string}
     * @constructor
     */
    static get ANIMATION_AXIS_Y_180() {
        return 'ANIMATION_AXIS_Y_180';
    }

    /**
     * It is type of animation
     *
     * @returns {string}
     * @constructor
     */
    static get ANIMATION_AXIS_Y() {
        return 'ANIMATION_AXIS_Y';
    }

    /**
     * Set mirror
     *
     * @returns {Text3D}
     */
    showMirror(status = true) {
        this._mirror = status;
        return this;
    }

    /**
     *
     * @param {number} far
     * @returns {Text3D}
     */
    setFar(far) {
        this._far = far;
        return this;
    }

    /**
     * Set height of hover
     *
     * @returns {Text3D}
     */
    setHover(hover) {
        this._hover = hover;
        return this;
    }

    /**
     * Set size of font
     *
     * @param {number} size
     * @returns {Text3D}
     */
    setSize(size) {
        this._size = size;
        return this;
    }

    /**
     * Set depth of font
     *
     * @param {number} depth
     * @returns {Text3D}
     */
    setDepth(depth) {
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
     * @param {eventDone} [completeRender]
     */
    write(text, completeRender) {
        this.load((font) => {
             let textGeo = new THREE.TextGeometry(
                 text,
                 {
                    font: font,
                    size: this._size,
                    height: this._depth,
                    curveSegments: this.curveSegments,
                    bevelThickness: 2,
                    bevelSize: 1.5,
                    bevelEnabled: true,
                    material: 0,
                    extrudeMaterial: 1
                });

            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let material = [
                new THREE.MeshPhongMaterial({color: this.colorFront, flatShading: THREE.FlatShading}),
                new THREE.MeshPhongMaterial({color: this.colorSide, flatShading: THREE.SmoothShading})
            ];
            let textMesh = new THREE.Mesh(textGeo, material);
            let centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

            textMesh.position.x = centerOffset;
            textMesh.position.y = this._hover;
            textMesh.rotation.y = Math.PI * 2;

            if (this._mirror) {
                this._mesh.add(textMesh);
                let mirrorMesh = new THREE.Mesh(textGeo, material);
                mirrorMesh.position.x = centerOffset;
                mirrorMesh.position.y = - this._hover;
                mirrorMesh.position.z = this._depth;
                mirrorMesh.rotation.x = Math.PI;
                mirrorMesh.rotation.y = Math.PI * 2;
                this._mesh.position.z = this._far;
                this._mesh.add(mirrorMesh);
            } else {
                this._mesh.add(textMesh);
                this._mesh.position.z = this._far;
            }

            if (completeRender) {
                completeRender(this._mesh);
            }
        });
    }

    /**
     * Get object Text
     *
     * @returns {?Mesh|Group}
     */
    get() {
        return this._mesh;
    }

    /**
     * Call this method inside function render
     *
     * @param {?string} [type] - Type of animation. Possible values it is constants of current class
     * @param {number} [speed] - It is speed animation
     */
    animation(type = Text3D.ANIMATION_AXIS_Y, speed = 0.01) {
        switch (type) {
            case Text3D.ANIMATION_AXIS_Y_180:
                this._mesh.rotation.y += (this._targetTextRotation - this._mesh.rotation.y) * speed;
                break;
            case Text3D.ANIMATION_AXIS_Y:
            default:
                this._mesh.rotation.y += speed;
                break;
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
    update(eventRender) {
        eventRender(this._mesh);
    }
}


export default Text3D;
