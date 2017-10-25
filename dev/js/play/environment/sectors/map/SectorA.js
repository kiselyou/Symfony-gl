import Sector from './Sector';
import PlanetEarth from './planets/PlanetEarth';
import {SECTOR_A} from './map';

class SectorA extends Sector {
	constructor() {
		super(SECTOR_A);

		this._prepare();
	}

	_prepare() {
		let earth = new PlanetEarth();
		this.planets.push(earth);
	}
}

export default SectorA;