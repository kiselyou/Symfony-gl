import Planet from './Planet';
import {PLANET_MOON} from './map';

class PlanetMoon extends Planet {
	constructor() {
		super(PLANET_MOON);
		
		this.setPosition({x: 0, y: 0, z: 384.400});
		this.rotationPlanet.set(0, 0, 0);
		this.rotationClouds.set(0, 0, 0);
		this.speed = 1.622 * 10;
		this.size = 1.737 * 10;
	}
}

export default PlanetMoon;