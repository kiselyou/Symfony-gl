
import Ajax from './Ajax';
import UIMessage from './ui/UIMessage';
import Sound from './../components/sound/Sound';

/** Class representing a base functional. */
class Application {
    constructor() {

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
