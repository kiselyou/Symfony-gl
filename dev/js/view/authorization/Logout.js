import Application from './../../system/Application';

let scope = null;

class Logout extends Application {
    constructor() {
        super();

        /**
         * List events
         *
         * @type {Array}
         */
        this.events = [];
    }

    /**
     *
     * @static
     * @returns {*|Logout}
     */
    static get() {
        return scope || (scope = new Logout());
    }

    /**
     * @callback eventLogout
     */

    /**
     * Logout
     *
     * @param {eventLogout} [listener] - listener logout
     * @returns {Logout}
     */
    run(listener) {
        this.ajax
            .post('/iw/logout', {})
            .then(() => {
                this.lock.unlock();

                if (listener) {
                    listener();
                }

                for (let event of this.events) {
                    event();
                }
            })
            .catch((e) => {
                console.log(e);
                this.msg.alert('Something was broken');
            });
        return this;
    }

    /**
     * Add listener logout
     *
     * @param {eventLogout} listener
     * @returns {Logout}
     */
    addEvent(listener) {
        this.events.push(listener);
        return this;
    }
}

export default Logout;