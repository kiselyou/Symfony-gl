import Ajax from './Ajax';
import Lock from './Lock';
import UIMessage from './ui/UIMessage';
import Indicators from './../view/panel/Indicators';
import Sound from './sound/Sound';
import uuidv4 from 'uuid/v4';

/**
 * Class representing a base functional.
 *
 * @class Application
 */
class Application {
    constructor() {

        /**
         *
         * @type {Lock}
         */
        this.lock = Lock.get();

        /**
         *
         * @type {Sound}
         */
        this.sound = new Sound();

        /**
         *
         * @type {Ajax}
         */
        this.ajax = new Ajax();

        /**
         *
         * @type {UIMessage}
         */
        this.msg = new UIMessage();


        /**
         * UUID
         *
         * @type {v4}
         */
        this._uuid = uuidv4;

        /**
         *
         * @type {Indicators}
         */
        this.indicators = Indicators.get();
    }

    /**
     * UUID
     *
     * @returns {*}
     */
    get uuid() {
        return this._uuid();
    }
}

export default Application;
