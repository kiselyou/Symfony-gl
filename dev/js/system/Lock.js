
import io from 'socket.io-client';
import Ajax from './Ajax';

let locker = null;

class Lock {
    /**
     *
     * @constructor
     */
    constructor() {

        /**
         * It is events to change status of user
         *
         * @type {Array.<eventChangeStatus>}
         * @private
         */
        this._eventsChangeStatus = [];

        /**
         * The socket object
         *
         * @type {?Object}
         */
        this.socketControls = null;

        /**
         * It is status of user.
         * If value is true it means that the page is locked and user is authenticated
         *
         * @type {boolean}
         */
        this.status = false;

        this._controls();
    }

    /**
     *
     * @returns {Lock}
     */
    static get() {
        return locker || (locker = new Lock());
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
     * This method create socket connect and add listeners
     *
     * @returns {void}
     * @private
     */
    _controls() {
        this._loadConfiguration((path) => {
            this.socketControls = io.connect(path);

            this.socketControls.on(Lock.EVENT_LOCK, (status) => {
                this._changeStatus(status);
            });

            this.socketControls.on(Lock.EVENT_UNLOCK, (status) => {
                this._changeStatus(status);
            });

            window.addEventListener('beforeunload', () => {
                this.unlock();
            });
        });
    }

    /**
     * Change status of user and is running listeners
     *
     * @param {boolean} status - The status of user
     * @private
     */
    _changeStatus(status) {
        this.status = status;
        for (let listener of this._eventsChangeStatus) {
            listener(this.status);
        }
    }

    /**
     * Lock the page if user is logged.
     * Usually you need call this method when user was authenticated in system
     *
     * @returns {void}
     */
    lock() {
        if (this.socketControls) {
            this.socketControls.emit(Lock.EVENT_LOCK);
        }
    }

    /**
     * Unlock the page if page was locked
     * Usually you need call this method when user left system
     *
     * @returns {void}
     */
    unlock() {
        if (this.socketControls) {
            this.socketControls.emit(Lock.EVENT_UNLOCK);
        }
    }

    /**
     * The event to get status of user
     *
     * @param {boolean} status true - If user id authenticated or false
     * @callback eventChangeStatus
     */

    /**
     * This method add event to change status.
     * The event to get status of user
     *
     * @param {eventChangeStatus} eventChangeStatus
     * @returns {Lock}
     */
    addEventChangeStatus(eventChangeStatus) {
        this._eventsChangeStatus.push(eventChangeStatus);
        return this;
    }
}

export default Lock;
