import Planet from './Planet';
import {PLANET_SUN} from './map';

class PlanetSun extends Planet {
	constructor() {
		super(PLANET_SUN);
		
		this.size = 90 * 10;
	}
}

export default PlanetSun;