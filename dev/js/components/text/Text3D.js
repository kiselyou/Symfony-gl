import * as THREE from 'three';
import Font3D from './Font3D';

class Text3D extends Font3D {

    constructor() {
        super();

        this._elements = [];

        /**
         * Count segments
         *
         * @type {number}
         */
        this.curveSegments = 8;

        /**
         * Color front
         *
         * @type {number}
         */
        this.colorFront = 0xffffff;

        /**
         * Color side
         *
         * @type {number}
         */
        this.colorSide = 0xffffff;

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
        this._size = 80;

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
     * @param {eventDone} done
     */
    write(text, done) {
        this.load((font) => {
             let textGeo = new THREE.TextGeometry(text, {
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
                new THREE.MeshPhongMaterial({color: this.colorFront, shading: THREE.FlatShading}),
                new THREE.MeshPhongMaterial({color: this.colorSide, shading: THREE.SmoothShading})
            ];
            let textMesh = new THREE.Mesh(textGeo, material);
            let centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

            textMesh.position.x = centerOffset;
            textMesh.position.y = this._hover;
            textMesh.rotation.y = Math.PI * 2;

            if (this._mirror) {
                let group = new THREE.Group();
                group.add(textMesh);

                let mirrorMesh = new THREE.Mesh(textGeo, material);
                mirrorMesh.position.x = centerOffset;
                mirrorMesh.position.y = - this._hover;
                mirrorMesh.position.z = this._depth;
                mirrorMesh.rotation.x = Math.PI;
                mirrorMesh.rotation.y = Math.PI * 2;
                group.position.z = this._far;
                group.add(mirrorMesh);
                this._elements.push(group);
                done(group);
            } else {
                textMesh.position.z = this._far;
                this._elements.push(textMesh);
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
    animation(type = Text3D.ANIMATION_AXIS_Y, speed = 0.01) {
        for (let element of this._elements) {
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
        for (let element of this._elements) {
            eventRender(element);
        }
    }
}


export default Text3D;
