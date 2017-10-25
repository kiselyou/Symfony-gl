import Sector from './Sector';
import PlanetEarth from './planets/PlanetEarth';
import {SECTOR_A} from './map';

class SectorA extends Sector {
	constructor() {
		super(SECTOR_A);
	}

	_prepare() {
		this.planets.push(
			new PlanetEarth()
		);
	}
}

export default SectorA;