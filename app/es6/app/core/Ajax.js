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
                    // xhr.setRequestHeader('Content-Type', 'application/json charset=utf-8');
                    // xhr.setRequestHeader('Content-Type', 'multipart/form-data charset=utf-8');
                    let data = Ajax._getFormData(param);
                    // console.log(data);
                    // console.log(data, 'formData11');
                    xhr.open(AJAX_POST, url);
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
    static _getFormData(param) {
        if (!(param instanceof FormData)) {
            var formData = new FormData();
            for (let key in param) {
                if (param.hasOwnProperty(key)) {
                    formData.append(key, param[key]);
                }
            }
            return formData;
        }
        return param;
    }

    /**
     * Send GET data
     *
     * @param {string} url
     * @returns {Promise}
     */
    get(url) {
        return new Promise((resolve, reject) => {
            this._execute(
                (xhr) => {
                    xhr.open(AJAX_GET, url);
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
