import qs from 'qs';
import ProgressAjax from './progress/ProgressAjax';

/**
 *
 * @type {string}
 */
const AJAX_GET = 'GET';

/**
 *
 * @type {string}
 */
const AJAX_POST = 'POST';

class Ajax {

    constructor() {
        /**
         * If it value is true will be shown ajax progress
         *
         * @type {boolean}
         */
        this._progress = true;
    }

    /**
     * Show or Hide Progress
     *
     * @param {boolean} show
     * @returns {Ajax}
     */
    _showProgress(show = true) {
        this._progress = show;
        return this;
    }

    /**
     * Start Progress
     *
     * @private
     * @returns {void}
     */
    _progressStart() {
        if (this._progress) {
            ProgressAjax.get().start();
        }
    }

    /**
     * Update Progress
     *
     * @param {XMLHttpRequest} xhr
     * @returns {Ajax}
     * @private
     */
    _progressUpdate(xhr) {
        if (this._progress) {
            xhr.onprogress = (e) => {
                if (e.lengthComputable) {
                    ProgressAjax.get().updateProgress(e.total, e.loaded);
                }
            };
        }
        return this;
    }

    /**
     * Stop Progress
     *
     * @private
     * @returns {void}
     */
    _progressStop() {
        if (this._progress) {
            ProgressAjax.get().stop();
        }
    }

    /**
     * Send POST data
     *
     * @param {string} url
     * @param {FormData|{}|Array} [param]
     * @param {boolean} [showProgress]
     * @returns {Promise}
     */
    post(url, param = {}, showProgress = true) {
        this
            ._showProgress(showProgress)
            ._progressStart();
        return new Promise((resolve, reject) => {
            this._execute(
                (xhr) => {
                    xhr.open(AJAX_POST, Ajax._prepareURL(url));
                    this
                        ._setHeaderHTTP(xhr)
                        ._progressUpdate(xhr);
                    xhr.send(Ajax._preparePostData(param));
                },
                resolve,
                reject
            );
        });
    };

    /**
     * Control params
     *
     * @param {FormData|{}|Array} param
     * @returns {FormData}
     * @private
     */
    static _preparePostData(param) {
        if (!(param instanceof FormData)) {
            let formData = new FormData();
            for (let key in param) {
                if (param.hasOwnProperty(key)) {
                    if (typeof param[key] === 'object') {
                        formData.append(key, qs.stringify(param[key], {encode: false}));
                    } else {
                        formData.append(key, param[key]);
                    }
                }
            }
            return formData;
        }
        return param;
    }

    /**
     * Prepare URL
     *
     * @param {string} url
     * @returns {string}
     * @static
     * @private
     */
    static _prepareURL(url) {
        return '/' + (url.replace(/^\/+/, ''));
    }

    /**
     * Prepare url to send on server
     *
     * @param {string} url
     * @param {({}|[])} [params]
     * @returns {string}
     * @static
     * @private
     */
    static _prepareGetURL(url, params = null) {
        let path = Ajax._prepareURL(url);
        return params ? qs.stringify(params, {addQueryPrefix: (path.indexOf('?') === -1)}) : '';
    }

    /**
     * Send GET data
     *
     * @param {string} url
     * @param {{}|[]} [params]
     * @param {boolean} [showProgress]
     * @returns {Promise}
     */
    get(url, params = null, showProgress = true) {
        this
            ._showProgress(showProgress)
            ._progressStart();
        return new Promise((resolve, reject) => {
            this._execute(
                (xhr) => {
                    xhr.open(AJAX_GET, Ajax._prepareGetURL(url, params));
                    this
                        ._setHeaderHTTP(xhr)
                        ._progressUpdate(xhr);
                    xhr.send();
                },
                resolve,
                reject
            );
        });
    };

    /**
     * Set HTTP Headers
     *
     * @param {XMLHttpRequest} xhr
     * @returns {Ajax}
     * @private
     */
    _setHeaderHTTP(xhr) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        return this;
    }

    /**
     * @param {XMLHttpRequest} xhr
     * @callback HttpRequestMethod
     */

    /**
     * @param {number} status
     * @param {string} statusText
     * @callback HttpResponseError
     */

    /**
     * @param {string} responseText
     * @callback HttpResponseSuccess
     */

    /**
     * Execute sending data to server
     *
     * @param {HttpRequestMethod} method
     * @param {HttpResponseSuccess} onSuccess
     * @param {HttpResponseError} [onError]
     * @returns {void}
     */
    _execute(method, onSuccess, onError = null) {
        let xhr = new XMLHttpRequest();
        method(xhr);
        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) {
                return;
            }

            this._progressStop();

            if (xhr.status != 200) {
                if (onError) {
                    onError(xhr.status, xhr.statusText);
                }
            } else {
                onSuccess(xhr.responseText);
            }
        };
    };
}

export default Ajax;
