import Lock from './../system/Lock';
import Ajax from './Ajax';
import UIMessage from './ui/UIMessage';
import Sound from './sound/Sound';
import ProgressAjax from './../view/progress/ProgressAjax';

/**
 * Class representing a base functional.
 *
 * @class Application
 */
class Application {
    constructor() {

        /**
         *
         * @type {ProgressAjax}
         */
        this.progress = new ProgressAjax();

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
    }
}

export default Application;
