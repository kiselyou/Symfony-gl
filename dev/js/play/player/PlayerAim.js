import * as THREE from 'three';
import InitScene from './../scene/InitScene';

class PlayerAim {
	constructor() {

		this._radius = 20;

		/**
		 *
		 * @type {InitScene}
		 * @private
		 */
		this._initScene = InitScene.get();

		/**
		 *
		 * @type {Group}
		 * @private
		 */
		this._aim = new THREE.Group();
	}

	removeAim() {

	}

	setAim() {
		let i = 0;
		let count = 6;
		let radius = 50;
		let step = (Math.PI * 2) / count;
		let angle = 0;
		let point = new THREE.Vector3(0, 0, 0);
		while (i < count) {
			let mesh = PlayerAim._drawArrow();
			mesh.position.set(
				point.x + (radius * Math.cos(angle)),
				0,
				point.z + (radius * Math.sin(angle))
			);


			// console.log(mesh.position);
			let angleRadians = Math.atan(point.z - mesh.position.z, point.x - mesh.position.x);
			mesh.rotation.set(0, 0, angleRadians);

			// console.log(mesh.position);

			// mesh.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
			// mesh.rotation.set(
			// 	point.x + (radius * Math.cos(angle)),
			// 	0,
			// 	-point.z + (radius * Math.sin(angle))
			// );
			// let dir = new THREE.Vector3(); // create once an reuse it
			// dir.subVectors(point, mesh.position);//.normalize();
			// mesh.rotation.set(dir.x, dir.y, dir.z);
            //
			// mesh.lookAt(point);

			this._aim.add(mesh);
			angle += step;
			i++;

		}
		this._initScene.add(this._aim);
		return this;
	}

	static _drawArrow() {
		let w = 30 / 2; // 30 - it is width of arrow
		let l = 50 / 2; // 50 - it is length of arrow
		let tl = 75; 	// 75 it is tail length
		let x = 0,
			y = 0;

		let triangleShape = new THREE.Shape();
		triangleShape.moveTo(x, y);
		triangleShape.lineTo(x + w, y + l);
		triangleShape.lineTo(x + 10, y + l);
		triangleShape.lineTo(x + 10, y + tl);
		triangleShape.lineTo(x - 10, y + tl);
		triangleShape.lineTo(x - 10, y + l);
		triangleShape.lineTo(x - w, y + l);
		triangleShape.moveTo(x, y);

		let geometry = new THREE.ShapeGeometry(triangleShape);
		let material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, overdraw: 0.5, side: THREE.DoubleSide});
		let mesh = new THREE.Mesh(geometry, material);
		return mesh;
	}
}

export default PlayerAim;