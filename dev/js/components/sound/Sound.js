
class Sound {

    constructor() {

        /**
         *
         * @type {HTMLElement}
         */
        this.container = document.body;

        if (window.hasOwnProperty('soundEmbed')) {
            this.son = window['soundEmbed']['son'];
        } else {
            // this.son = document.createElement('embed');
            // this.container.appendChild(this.son);
            window['soundEmbed'] = this;
        }
    }

    /**
     *
     * @param {string} source
     * @param {number} [volume]
     */
    start(source, volume = 50) {
        this.son = document.createElement('embed');
        this.son.setAttribute('src', source);
        this.son.setAttribute('hidden', 'true');
        this.son.setAttribute('volume', String(volume));
        this.son.setAttribute('autostart', 'true');
        this.son.setAttribute('type', 'audio/mpeg');
        this.container.appendChild(this.son);

        return this;
    }

    /**
     *
     * @returns {Sound}
     */
    remove() {
        this.container.removeChild(this.son);
        return this;
    }
}

export default Sound;