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
                    xhr.open(AJAX_POST, url);
                    // xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    let data = Ajax._getFormData(param);
                    console.log(data);
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
        console.log(!param instanceof FormData);
        if (!param instanceof FormData) {
            var formData = new FormData();
            for (let key in param) {
                if (param.hasOwnProperty(key)) {
                    formData.append(key, param[key]);
                }
            }
            console.log(formData);
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
