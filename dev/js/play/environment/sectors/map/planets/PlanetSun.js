import Planet from './Planet';
import {PLANET_SUN} from './map';

class PlanetSun extends Planet {
	constructor() {
		super(PLANET_SUN);

		this.heightSegments = 64;
		this.widthSegments = 64;
		let scale = 3;
		this.setPosition({x: 2500 * scale, y: 200 * scale, z: -2000 * scale});
		this.size = 80 * 10;
	}
}

export default PlanetSun;