import * as THREE from 'three';
import Player from './Player';
import Loader from './../../play/loader/Loader';

class PlayerControls extends Player {
	constructor() {
		super();

		/**
		 *
		 * @type {Loader}
		 * @private
		 */
		this._loader = Loader.get();
	}

	/**
	 *
	 * @param {function} listener
	 * @return {PlayerControls}
	 */
	load(listener) {
		this._loader.load((loader) => {
			this.setShip(loader.getModel(this.modelShipName));
			if (listener) {
				listener();
			}
		}, this.modelShipName);
		return this;
	}

	point(position) {
		let geometry = new THREE.SphereGeometry(10, 10, 10);
		let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		let mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(position);
		this.initScene.scene.add(mesh);
	}

    /**
     *
     * @returns {PlayerControls}
     */
    initEvents() {
        this.initScene.domElement.addEventListener('click', (e) => {

			let destination = this.initScene.getClickPosition(e);
			console.log(destination);
			this.point(destination);



            //
            // let r = 150;
            // let model = this.getShip();
            // let op = model.getPosition();
            // let v = model.getObject().getWorldDirection();
            // let direction = Math.atan2(v.x, v.z);
            //
            // let angleToP = direction - 90;
            //
            // // TODO to function
            // let p = {};
            // p.x = op.x + r * Math.cos(angleToP);
            // p.y = op.y + r * Math.sin(angleToP);
            //
            // let d = {};
            // d.x = destination.x - p.x;
            // d.y = destination.y - p.y;
            // let h = Math.sqrt(d.x * d.x + d.y * d.y);
            //
            // if (h < r) {
				// // TODO the same as above
				// p = {};
				// p.x = op.x + (h / 2) * Math.cos(angleToP);
				// p.y = op.y + (h / 2) * Math.sin(angleToP);
            //
				// d = {};
				// d.x = destination.x - p.x;
				// d.y = destination.y - p.y;
				// h = Math.sqrt(d.x * d.x + d.y * d.y);
            // }
            //
            // let dLite = Math.sqrt(h * h - r * r);
            // let theta = Math.acos(r / h);
            //
            //
            // let phi = Math.atan(d.y / d.x);
            // let q = {};
            // q.x = p.x + r * Math.cos(phi + theta);
            // q.y = p.y + r * Math.sin(phi + theta);
            //
            // console.log(destination, p, h);
        });
        return this;
    }
}

export default PlayerControls;