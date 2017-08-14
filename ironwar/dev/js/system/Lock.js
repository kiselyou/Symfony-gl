
import io from 'socket.io-client';
import Ajax from './Ajax';

let socketControls = null;

class Lock {
    /**
     *
     * @constructor
     */
    constructor() {

        /**
         *
         * @type {Ajax}
         * @private
         */
        this._ajax = new Ajax();

        /**
         *
         * @type {{}}
         * @private
         */
        this._config = {};

        if(!socketControls) {
            this._controls();
        } else {
            throw new Error('This class "Lock" has already running!');
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
    static get EVENT_CHECK_LOCK() {
        return 'EVENT_CHECK_LOCK';
    }

    /**
     *
     * @returns {string}
     */
    static get EVENT_CHECK_USER_STATUS() {
        return 'EVENT_CHECK_USER_STATUS';
    }

    /**
     * @param {string} path
     * @callback loadedConfiguration
     */

    /**
     * Get configuration of socket server
     *
     * @param {loadedConfiguration} done
     * @private
     */
    _loadConfiguration(done) {
        if (this._config.hasOwnProperty('path')) {
            done(this._config['path']);
            return;
        }
        this._ajax.post('socket/info', {key: 'Lock'})
            .then((res) => {
                try {
                    this._config = JSON.parse(res);
                    this._config['path'] = this._config['host'] + ':' + this._config['port'] + Lock.NAMESPACE;
                    done(this._config['path']);
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
            socketControls.on(Lock.EVENT_CHECK_LOCK, (data) => {
                if (data['lock']) {
                    console.log('User was added to list');
                } else {
                    console.log('Probably user is not logged or has opened another tabs');
                }
            });
        });
    }

    /**
     * @param {boolean} status
     * @callback isUserCallback
     */

    /**
     *
     * @param {isUserCallback} callback
     */
    isUser(callback) {
        if (!socketControls) {
            setTimeout(() => {
                this.isUser(callback);
            }, 20);
        } else {
            socketControls.emit(Lock.EVENT_CHECK_USER_STATUS);
            socketControls.on(Lock.EVENT_CHECK_USER_STATUS, (status) => {
                callback(status);
            });
        }
    }
}

export default Lock;
