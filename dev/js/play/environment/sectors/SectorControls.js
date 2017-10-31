import SkyBox from './../SkyeBox';
import SectorA from './map/SectorA';
import SectorB from './map/SectorB';
import SectorC from './map/SectorC';
import SectorD from './map/SectorD';
import SectorI from './map/SectorI';

class SectorControls {
	/**
	 *
	 * @param {Scene} scene
	 */
	constructor(scene) {

		/**
		 *
		 * @type {Scene}
		 * @private
		 */
		this._scene = scene;

		/**
		 *
		 * @type {SkyeBox}
		 */
		this.sky = new SkyBox(this._scene);

		/**
		 *
		 * @type {Array.<Sector>}
		 */
		this.setors = [
			new SectorA(),
			new SectorB(),
			new SectorC(),
			new SectorD(),
			new SectorI()
		];

		/**
		 *
		 * @type {?Sector}
		 */
		this.sector = null;
	}

	/**
	 *
	 * @param {number} key - this is number of sector
	 * @returns {SectorControls}
	 */
	init(key) {

		this.sector = this.setors.find((sector) => {
			return sector.key === key;
		});

		this.sky.initEnv(this.sector.skyBoxPath);

		this.sector.prepare();
		this.sector.addTo(this._scene);

		for (let light of this.sector.lights) {
			this._scene.add(light);
		}

		return this;
	}

	/**
	 *
	 * @returns {SectorControls}
	 */
	remove() {
		this.sky.removeEnv();
		if (this.sector) {
			this.sector.removeFrom(this._scene);
			this.sector = null;
		}
		return this;
	}

	/**
	 * Gets plane of sky box
	 *
	 * @returns {Mesh}
	 */
	get plane() {
		return this.sky.plane;
	}

	/**
	 *
	 * @param {Vector3} skyBoxPos
	 * @param {number} deltaTime
	 */
	update(skyBoxPos, deltaTime) {
		if (this.sector) {
			this.sky.setPosition(skyBoxPos);
			this.sector.update(deltaTime);
		}
	}
}

export default SectorControls;