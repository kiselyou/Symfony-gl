import Planet from './Planet';
import {PLANET_EARTH} from './map';

class PlanetEarth extends Planet {
	constructor() {
		super(PLANET_EARTH);
		
		this.bumpScale = 2;
		
		this.setPosition({x: 1000, y: 0, z: 2500});
		this.size = 6.371 * 10;

		this.speed = 10;
	}
}

export default PlanetEarth;