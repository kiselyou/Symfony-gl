
import EJSController from './systems/EJSController';

class Collection {
    constructor(server) {
        this.EJSController = new EJSController(server);
    }
}

export default Collection;
