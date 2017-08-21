
import io from 'socket.io-client';
import Ajax from './Ajax';

class Lock {
    /**
     *
     * @constructor
     */
    constructor() {

        /**
         *
         * @type {?eventCheckLock}
         * @private
         */
        this._eventCheckLock = null;

        /**
         *
         * @type {?Object}
         */
        this.socketControls = null;

        if (!window._lock) {
            window._lock = this;
            this._controls();
        } else {
            this.socketControls = window._lock.socketControls;
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
        return 'EVENT_CONNECT';
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
     *
     * @returns {string}
     */
    static get EVENT_CHECK_LOCK() {
        return 'EVENT_CHECK_LOCK';
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
            this.socketControls = io.connect(path);

            this.socketControls.on(Lock.EVENT_CHECK_LOCK, (status) => {
                if (this._eventCheckLock) {
                    this._eventCheckLock(status);
                }
            });

            window.addEventListener('beforeunload', () => {
                this.socketControls.emit(Lock.EVENT_UNLOCK);
            });
        });
    }

    /**
     * Lock page if user is logged
     *
     * @returns {void}
     */
    lock() {
        if (this.socketControls) {
            this.socketControls.emit(Lock.EVENT_LOCK);
        }
    }

    /**
     * Unlock page if page was locked
     *
     * @returns {void}
     */
    unlock() {
        if (this.socketControls) {
            this.socketControls.emit(Lock.EVENT_UNLOCK);
        }
    }

    /**
     * Check user status
     *
     * @param {boolean} status true - If authenticated user is on the page else false
     * @callback eventCheckLock
     */

    /**
     * Check that authenticated user is on the page
     *
     * @param {eventCheckLock} eventCheckLock
     * @returns {void}
     */
    isLocked(eventCheckLock) {
        if (this.socketControls) {
            this.socketControls.emit(Lock.EVENT_CHECK_LOCK);
            this._eventCheckLock = eventCheckLock;
        }
    }
}

export default Lock;
