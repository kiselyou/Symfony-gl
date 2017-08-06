
import io from 'socket.io-client';

class Lock {
    /**
     *
     * @constructor
     */
    constructor() {


    }

    /**
     *
     * @returns {string}
     */
    static get NAMESPACE() {
        return '/lock';
    }

    /**
     *
     * @returns {number}
     */
    static get PORT() {
        return 3000;
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_CHECK_STATUS() {
        return 'check';
    }

    /**
     *
     * @returns {void}
     */
    controls() {
        let socket = io.connect(location.hostname + ':' + Lock.PORT + Lock.NAMESPACE);

        socket.on(Lock.EVENT_CHECK_STATUS, (data) => {


            console.log(data, 'client1');
        });
    }
}

export default Lock;
