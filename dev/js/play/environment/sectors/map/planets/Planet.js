import * as THREE from 'three';
import IMGLoader from '../../../../loader/IMGLoader';
import {PLANET_NAMES, PLANET_PATH} from './map';

class Planet {
	/**
	 * This is key of planet
	 *
	 * @param {number} key
	 */
	constructor(key) {
		/**
		 *
		 * @type {number}
		 */
		this.key = key;

		/**
		 *
		 * @type {string}
		 */
		this.name = PLANET_NAMES[key];

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._planetPathMap = PLANET_PATH[key]['map'];

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._planetPathBump = PLANET_PATH[key]['bump'];

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._planetPathSpec = PLANET_PATH[key]['spec'];

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._planetPathCloudMap = PLANET_PATH[key]['cloud_map'];

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._planetPathCloudMapTrans = PLANET_PATH[key]['cloud_map_trans'];

		/**
		 *
		 * @type {IMGLoader}
		 * @private
		 */
		this._textureLoader = IMGLoader.get();

		/**
		 *
		 * @type {number}
		 */
		this.radius = 50;

		/**
		 *
		 * @type {number}
		 */
		this.widthSegments = 32;

		/**
		 *
		 * @type {number}
		 */
		this.heightSegments = 32;

		/**
		 *
		 * @type {Vector3}
		 */
		this.defaultPosition = new THREE.Vector3();

		/**
		 *
		 * @type {?Mesh}
		 * @private
		 */
		this._planet = null;

		/**
		 *
		 * @type {?Mesh}
		 * @private
		 */
		this._planetClouds = null;

		/**
		 *
		 * @type {number}
		 */
		this.cloudsSize = 0.5;

		/**
		 *
		 * @type {number}
		 */
		this.y = 10;
	}

	/**
	 *
	 * @param {Vector3} v
	 * @returns {Planet}
	 */
	setPosition(v) {
		this._planet.position.set(v.x, v.y - (this.radius + this.y), v.z);
		return this;
	}

	/**
	 *
	 * @returns {Mesh}
	 */
	get() {
		if (!this._planet) {
			this._buildPlanet();
		}
		return this._planet;
	}

	/**
	 *
	 * @param {number} deltaTime
	 * @returns {void}
	 */
	update(deltaTime) {
		this._planet.rotation.y  += 1 / 32 * deltaTime;
		this._planetClouds.rotation.y  += 1 / 16 * deltaTime;
	}

	/**
	 * Build planet
	 *
	 * @private
	 * @returns {void}
	 */
	_buildPlanet() {
		this._buildClouds();
		let geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
		let material = new THREE.MeshPhongMaterial({
			map: this._textureLoader.find(this._planetPathMap),
			bumpMap: this._textureLoader.find(this._planetPathBump),
			bumpScale: 1,
			specularMap: this._textureLoader.find(this._planetPathSpec),
			specular: new THREE.Color('grey'),
		});

		this._planet = new THREE.Mesh(geometry, material);
		this._planet.receiveShadow	= true;
		this._planet.add(this._planetClouds);
		this.setPosition(this.defaultPosition);
	}

	/**
	 * Build clouds of planet
	 *
	 * @private
	 * @returns {void}
	 */
	_buildClouds() {
		if (!this._planetClouds) {

			let canvasResult = document.createElement('canvas');
			canvasResult.width = 1024;
			canvasResult.height	= 512;
			let contextResult = canvasResult.getContext('2d');

			let material = new THREE.MeshPhongMaterial({
				map: new THREE.Texture(canvasResult),
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.8
			});

			let imageMap = new Image();
			imageMap.addEventListener('load', () => {

				// create dataMap ImageData for cloud map
				let canvasMap = document.createElement('canvas');
				canvasMap.width	= imageMap.width;
				canvasMap.height = imageMap.height;
				let contextMap = canvasMap.getContext('2d');
				contextMap.drawImage(imageMap, 0, 0);
				let dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

				// load cloud map trans
				let imageTrans = new Image();
				imageTrans.addEventListener('load', () => {
					// create dataTrans ImageData for cloud map trans
					let canvasTrans	= document.createElement('canvas');
					canvasTrans.width = imageTrans.width;
					canvasTrans.height = imageTrans.height;
					let contextTrans = canvasTrans.getContext('2d');
					contextTrans.drawImage(imageTrans, 0, 0);
					let dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
					// merge dataMap + dataTrans into dataResult
					let dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
					for(let y = 0, offset = 0; y < imageMap.height; y++) {
						for(let x = 0; x < imageMap.width; x++, offset += 4) {
							dataResult.data[offset]	= dataMap.data[offset];
							dataResult.data[offset + 1]	= dataMap.data[offset + 1];
							dataResult.data[offset + 2]	= dataMap.data[offset + 2];
							dataResult.data[offset + 3]	= 255 - dataTrans.data[offset];
						}
					}
					// update texture with result
					contextResult.putImageData(dataResult, 0, 0);
					material.map.needsUpdate = true;
				});
				imageTrans.src = this._planetPathCloudMapTrans;
			}, false);

			imageMap.src = this._planetPathCloudMap;
			let radius = this.radius + (this.radius / 100 * this.cloudsSize);
			let geometry = new THREE.SphereGeometry(radius, this.widthSegments, this.heightSegments);
			this._planetClouds = new THREE.Mesh(geometry, material);
		}
	}
}

export default Planet