import qs from 'qs';

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

    /**
     * Send POST data
     *
     * @param {string} url
     * @param {FormData|{}|Array} param
     * @returns {Promise}
     */
    post(url, param) {
        return new Promise((resolve, reject) => {
            this._execute(
                (xhr) => {
                    xhr.open(AJAX_POST, Ajax._preparePostData(param));
                    xhr.send(data);
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
            var formData = new FormData();
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
     * Prepare url to send on server
     *
     * @param {string} url
     * @param {{}|[]} [params]
     * @returns {string}
     * @private
     */
    static _prepareGetURL(url, params = null) {
        return params ? qs.stringify(params, {addQueryPrefix: (url.indexOf('?') === -1)}) : '';
    }

    /**
     * Send GET data
     *
     * @param {string} url
     * @param {{}|[]} [params]
     * @returns {Promise}
     */
    get(url, params = null) {
        return new Promise((resolve, reject) => {
            this._execute(
                (xhr) => {
                    xhr.open(AJAX_GET, Ajax._prepareGetURL(url, params));
                    xhr.send();
                },
                resolve,
                reject
            );
        });
    };

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
