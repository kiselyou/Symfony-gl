import * as THREE from 'three';

let fonts = {};

const PATH_FONT_AUDIO_WIDE = '/src/fonts/Audiowide/Audiowide_Regular.json';

class Font3D {
    constructor() {

        this._loader = new THREE.FontLoader();
    }

    /**
     * It is type of default font
     *
     * @returns {string}
     * @constructor
     */
    static get FONT_DEFAULT() {
        return 'AUDIO_WIDE';
    }

    /**
     * Call this method when font was uploaded
     *
     * @param {Font}
     * @callback eventLoad
     */

    /**
     * Loading font
     *
     * @param {eventLoad} event
     * @param {string} type
     * @returns {void}
     */
    load(event, type = Font3D.FONT_DEFAULT) {
        if (fonts.hasOwnProperty(type)) {
            event(fonts[type]);
        } else {
            this._loader.load(PATH_FONT_AUDIO_WIDE, (font) => {
                fonts[type] = font;
                event(font);
            });
        }
    }
}

export default Font3D;
