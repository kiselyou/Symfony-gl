
import io from 'socket.io-client';
import Ajax from './Ajax';

let socketControls = null;

class Lock {
    /**
     *
     * @constructor
     */
    constructor() {

        if(!socketControls) {
            this._controls();
        }
    }

    /**
     *
     * @param {Error} error
     * @private
     */
    static alert(error) {
        console.log(error);
        alert('Something was broken');
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
     * @returns {string}
     */
    static get EVENT_CONNECT() {
        return 'EVENT_CONNECT_';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_LOCK() {
        return 'EVENT_LOCK';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_UNLOCK() {
        return 'EVENT_CHECK_UNLOCK';
    }

    /**
     * @param {{path: string, host: string, port: number}} path
     * @callback loadedConfiguration
     */

    /**
     * Get configuration of socket server
     *
     * @param {loadedConfiguration} done
     * @private
     */
    _loadConfiguration(done) {
        let ajax = new Ajax();
        ajax.post('socket/info', {key: 'Lock'})
            .then((res) => {
                try {
                    let config = JSON.parse(res);
                    config['path'] = config['host'] + ':' + config['port'] + Lock.NAMESPACE;
                    done(config['path']);
                } catch (error) {
                    Lock.alert(error);
                }
            })
            .catch((error) => {
                Lock.alert(error);
            });
    }

    /**
     * This method check lock status
     *
     * @returns {void}
     * @private
     */
    _controls() {
        this._loadConfiguration((path) => {
            socketControls = io.connect(path);
            socketControls.on(Lock.EVENT_CONNECT, (data) => {
                if (data['lock']) {
                    console.log('User was added to list');
                } else {
                    console.log('Probably user is not logged or has opened another tabs');
                }
            });

            window.addEventListener('beforeunload', function () {
                socketControls.emit(Lock.EVENT_UNLOCK);
            });
        });
    }

    static lock() {
        if (socketControls) {
            socketControls.emit(Lock.EVENT_LOCK);
        }
    }

    static unlock() {
        if (socketControls) {
            socketControls.emit(Lock.EVENT_UNLOCK);
        }
    }
}

export default Lock;
