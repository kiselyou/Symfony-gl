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
		 * Radius of planet
		 *
		 * @type {number}
		 */
		this.size = 50;
		
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
		 * @type {?Mesh}
		 * @private
		 */
		this._planet = null;
		
		/**
		 *
		 * @type {Array.<Planet>}
		 * @private
		 */
		this._children = [];
		
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
		this.cloudsSize = 0.6;
		
		/**
		 *
		 * @type {number}
		 */
		this.bumpScale = 0.1;
		
		/**
		 *
		 * @type {number}
		 */
		this.y = 5;
		
		/**
		 *
		 * @type {Vector3}
		 */
		this.defaultPosition = new THREE.Vector3();
		
		/**
		 *
		 * @type {Vector3}
		 */
		this.rotationPlanet = new THREE.Vector3(0, 1 / 32, 0);
		
		/**
		 *
		 * @type {Vector3}
		 */
		this.rotationClouds = new THREE.Vector3(0, 1 / 16, 0);
		
		/**
		 *
		 * @type {Vector3}
		 */
		this.parentPosition = new THREE.Vector3(0, 0, 0);
		
		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isParent = false;
		
		/**
		 * Speed moving planet around parent
		 *
		 * @type {number}
		 */
		this.speed = 20;
		
		/**
		 *
		 * @type {?number}
		 * @private
		 */
		this._direction = null;
		
		/**
		 * Distance between current planet and parent
		 *
		 * @type {number}
		 * @private
		 */
		this._distance = 0;
	}
	
	/**
	 *
	 * @param {Vector3} v
	 * @returns {Planet}
	 * @private
	 */
	_setParentPosition(v) {
		this._isParent = true;
		this.parentPosition.copy(v);
		return this;
	}
	
	/**
	 *
	 * @param {Planet} planet
	 * @returns {Planet}
	 */
	addChildren(planet) {
		this._children.push(planet);
		return this;
	}
	
	/**
	 *
	 * @param {(Vector3|{x: number, y: number, z: number})} v
	 * @returns {Planet}
	 */
	setPosition(v) {
		this.defaultPosition.copy(v);
		return this;
	}
	
	/**
	 *
	 * @returns {Mesh}
	 */
	get() {
		if (!this._planet) {
			this.buildPlanet();
		}
		return this._planet;
	}
	
	/**
	 *
	 * @returns {number}
	 * @private
	 */
	static angleDirection(a, b) {
		return Math.atan2(b.z - a.z, b.x - a.x);
	}
	
	/**
	 * Get position motion to
	 *
	 * @param {Vector3} point
	 * @param {number} angle
	 * @param {number} far
	 * @returns {{ x: number, y: number, z: number }}
	 */
	static calcArcPosition(point, angle, far) {
		return {
			x: point.x + (far * Math.cos(angle)),
			y: 0,
			z: point.z + (far * Math.sin(angle))
		};
	}
	
	/**
	 *
	 * @param {number} deltaTime
	 * @returns {void}
	 */
	update(deltaTime) {
		if (this._planet) {
			this._planet.rotation.x += this.rotationPlanet.x * deltaTime;
			this._planet.rotation.y += this.rotationPlanet.y * deltaTime;
			this._planet.rotation.z += this.rotationPlanet.z * deltaTime;

			if (this._planetClouds) {
				this._planetClouds.rotation.x += this.rotationClouds.x * deltaTime;
				this._planetClouds.rotation.y += this.rotationClouds.y * deltaTime;
				this._planetClouds.rotation.z += this.rotationClouds.z * deltaTime;
			}
			
			if (this._isParent) {
				if (!this._direction) {
					this._direction = Planet.angleDirection(this.parentPosition, this._planet.position);
					this._distance = this.parentPosition.distanceTo(this._planet.position);
				}
				
				this._direction += (this.speed * deltaTime) / this._distance;
				this._planet.position.copy(Planet.calcArcPosition(this.parentPosition, this._direction, this._distance));
			}
			
			for (let planetChildren of this._children) {
				planetChildren
					._setParentPosition(this._planet.position)
					.update(deltaTime);
			}
		}
	}
	
	/**
	 * Build planet
	 *
	 * @returns {void}
	 */
	buildPlanet() {
		let geometry = new THREE.SphereGeometry(this.size, this.widthSegments, this.heightSegments);
		let material = new THREE.MeshStandardMaterial({
			map: this._textureLoader.find(this._planetPathMap),
			bumpScale: this._planetPathBump ? this.bumpScale : null,
			bumpMap: this._planetPathBump ? this._textureLoader.find(this._planetPathBump) : null,
			specularMap: this._planetPathSpec ? this._textureLoader.find(this._planetPathSpec) : null,
			specular: new THREE.Color('grey'),
		});
		
		this._planet = new THREE.Mesh(geometry, material);
		
		if (this._planetPathCloudMap && this._planetPathCloudMapTrans) {
			this._planetClouds = this._buildClouds();
			this._planet.add(this._planetClouds);
		}
		
		for (let planetChildren of this._children) {
			this._planet.add(planetChildren.get());
		}
		
		this._planet.position.set(
			this.defaultPosition.x,
			this.defaultPosition.y - (this.size + this.y),
			this.defaultPosition.z
		);
	}
	
	/**
	 * Build clouds of planet
	 *
	 * @private
	 * @returns {Mesh}
	 */
	_buildClouds() {
			let canvasResult = document.createElement('canvas');
			canvasResult.width = 1024;
			canvasResult.height = 512;
			let contextResult = canvasResult.getContext('2d');
			
			let material = new THREE.MeshStandardMaterial({
				map: new THREE.Texture(canvasResult),
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.8
			});
			
			let imageMap = new Image();
			imageMap.addEventListener('load', () => {
				
				// create dataMap ImageData for cloud map
				let canvasMap = document.createElement('canvas');
				canvasMap.width = imageMap.width;
				canvasMap.height = imageMap.height;
				let contextMap = canvasMap.getContext('2d');
				contextMap.drawImage(imageMap, 0, 0);
				let dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
				
				// load cloud map trans
				let imageTrans = new Image();
				imageTrans.addEventListener('load', () => {
					// create dataTrans ImageData for cloud map trans
					let canvasTrans = document.createElement('canvas');
					canvasTrans.width = imageTrans.width;
					canvasTrans.height = imageTrans.height;
					let contextTrans = canvasTrans.getContext('2d');
					contextTrans.drawImage(imageTrans, 0, 0);
					let dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
					// merge dataMap + dataTrans into dataResult
					let dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
					for (let y = 0, offset = 0; y < imageMap.height; y++) {
						for (let x = 0; x < imageMap.width; x++, offset += 4) {
							dataResult.data[offset] = dataMap.data[offset];
							dataResult.data[offset + 1] = dataMap.data[offset + 1];
							dataResult.data[offset + 2] = dataMap.data[offset + 2];
							dataResult.data[offset + 3] = 255 - dataTrans.data[offset];
						}
					}
					// update texture with result
					contextResult.putImageData(dataResult, 0, 0);
					material.map.needsUpdate = true;
				});
				imageTrans.src = this._planetPathCloudMapTrans;
			}, false);
			
			imageMap.src = this._planetPathCloudMap;
			let radius = this.size + (this.size / 100 * this.cloudsSize);
			let geometry = new THREE.SphereGeometry(radius, this.widthSegments, this.heightSegments);
			return new THREE.Mesh(geometry, material);
	}
}

export default Planet