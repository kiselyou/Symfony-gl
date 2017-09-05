
class Sound {

    constructor() {

        /**
         *
         * @type {HTMLElement}
         */
        this.container = document.body;

        /**
         *
         * @type {number}
         */
        this.volume = 0.3;
    }

    /**
     *
     * @param {string} source
     */
    play(source) {
        var audio = new Audio(source);
        audio.volume = this.volume;
        audio.play();
    }
}

export default Sound;